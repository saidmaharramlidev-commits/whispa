import ActionButtons from "@/components/ActionButtons";
import FeedbackCard from "@/components/FeedbackCard";
import LikedOverlay from "@/components/LikedOverlay";
import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";



type Feedback = {
  _id: string;
  text: string;
  isLiked: boolean;
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isLoaded, isSignedIn } = useAuth();
  const api = useApi();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [likedFeedbacks, setLikedFeedbacks] = useState<Feedback[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLiked, setShowLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchFeedbacks();
      fetchLikedFeedbacks();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await api.getMyFeedbacks();
      setFeedbacks(data.data);
    } catch (err) {
      console.error("Failed to load feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedFeedbacks = async () => {
    try {
      const data = await api.getLikedFeedbacks();
      setLikedFeedbacks(data.data);
    } catch (err) {
      console.error("Failed to load liked feedbacks:", err);
    }
  };

  const handleLike = async () => {
    const feedback = feedbacks[currentIndex];
    setCurrentIndex(prev => prev + 1);
    try {
      await api.toggleLikeFeedback(feedback._id);
      const data = await api.getLikedFeedbacks();
      setLikedFeedbacks(data.data);
    } catch (err) {
      console.error("Failed to like feedback:", err);
    }
  };

  const handleDelete = async () => {
    const feedback = feedbacks[currentIndex];
    setCurrentIndex(prev => prev + 1);
    try {
      await api.deleteFeedback(feedback._id);
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    }
  };

  const currentFeedback = feedbacks[currentIndex];
  const isFinished = currentIndex >= feedbacks.length;

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-black"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="text-white text-2xl font-bold tracking-wider">
          {i18n.t("appName")}
        </Text>
        <TouchableOpacity
          onPress={() => setShowLiked(true)}
          className="bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#282828]"
        >
          <Text className="text-white text-sm font-semibold">{i18n.t("liked")}</Text>
        </TouchableOpacity>
      </View>

      {/* Liked Overlay */}
      {showLiked && (
        <LikedOverlay
          likedFeedbacks={likedFeedbacks}
          onClose={() => setShowLiked(false)}
          onUnlike={(id) => setLikedFeedbacks(prev => prev.filter(f => f._id !== id))}
        />
      )}

      {/* Feed */}
      {isFinished ? (
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-5xl">🎉</Text>
          <Text className="text-white text-lg font-bold">{i18n.t("allCaughtUp")}</Text>
          <Text className="text-[#b3b3b3] text-sm text-center px-10">
            {i18n.t("noMoreWhispas")}
          </Text>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-[#b3b3b3] text-sm mb-6">
            {currentIndex + 1} / {feedbacks.length}
          </Text>
          <FeedbackCard text={currentFeedback.text} />
          <ActionButtons onLike={handleLike} onDelete={handleDelete} />
        </View>
      )}
    </View>
  );
}