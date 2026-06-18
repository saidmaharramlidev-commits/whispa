import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { useUser } from "@clerk/expo";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UserProfile = {
    _id: string;
    username: string;
    bio: string;
    avatarUrl: string;
    followers: any[];
    following: any[];
    isAcceptingFeedback: boolean;
    followersOnly: boolean;
    isFollowedByThem: boolean;
    showFollowers: boolean;
    showFollowing: boolean;
};

export default function UserProfileScreen() {
    const insets = useSafeAreaInsets();
    const { username } = useLocalSearchParams();
    const { user: clerkUser } = useUser();
    const api = useApi();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowedByThem, setIsFollowedByThem] = useState(false);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [feedbackError, setFeedbackError] = useState("");
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);

    useEffect(() => {
        fetchUser();
    }, [username]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await api.getUserByUsername(username as string);
            setUser(data.data);
            setIsFollowing(data.data.isFollowing);
            setIsFollowedByThem(data.data.isFollowedByThem);
        } catch (err) {
            console.error("Failed to load user:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFollow = async () => {
        if (!clerkUser || !user) return;
        setIsFollowing(prev => !prev);
        try {
            await api.toggleFollow(user.username);
            await fetchUser();
        } catch (err) {
            setIsFollowing(prev => !prev);
            console.error("Failed to toggle follow:", err);
        }
    };

    const handleSendFeedback = async () => {
        setFeedbackError("");
        if (feedbackText.trim().length < 2) {
            setFeedbackError(i18n.t("whispaTooShort"));
            return;
        }
        if (feedbackText.trim().length > 200) {
            setFeedbackError("Whispa cannot exceed 200 characters");
            return;
        }
        if (!feedbackText.trim()) return;
        try {
            setFeedbackLoading(true);
            await api.sendFeedback(user!.username, feedbackText);
            setFeedbackSent(true);
            setFeedbackText("");
            setTimeout(() => {
                setFeedbackModalVisible(false);
                setFeedbackSent(false);
            }, 1500);
        } catch (err) {
            console.error("Failed to send feedback:", err);
        } finally {
            setFeedbackLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    if (!user) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-[#b3b3b3]">{i18n.t("userNotFound")}</Text>
            </View>
        );
    }

    const canWhispa = user.isAcceptingFeedback && (!user.followersOnly || isFollowedByThem);

    return (
        <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>

            {/* Avatar Full Screen Modal */}
            <Modal
                visible={avatarModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAvatarModalVisible(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/90 justify-center items-center"
                    onPress={() => setAvatarModalVisible(false)}
                    activeOpacity={1}
                >
                    {user.avatarUrl ? (
                        <Image
                            source={{ uri: user.avatarUrl }}
                            style={{ width: 300, height: 300, borderRadius: 150 }}
                        />
                    ) : (
                        <View
                            style={{ width: 300, height: 300, borderRadius: 150 }}
                            className="bg-[#1a1a1a] border border-[#282828] justify-center items-center"
                        >
                            <Text className="text-white font-bold" style={{ fontSize: 120 }}>
                                {user.username[0].toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Text className="text-[#555] text-sm mt-6">{i18n.t("tapToClose")}</Text>
                </TouchableOpacity>
            </Modal>

            {/* Send Whispa Modal */}
            <Modal
                visible={feedbackModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setFeedbackModalVisible(false)}
            >
                <View className="flex-1 bg-black px-6" style={{ paddingTop: insets.top }}>
                    <View className="flex-row justify-between items-center py-4 mb-4">
                        <Text className="text-white text-xl font-bold">{i18n.t("sendWhispa")}</Text>
                        <TouchableOpacity
                            onPress={() => setFeedbackModalVisible(false)}
                            className="bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#282828]"
                        >
                            <Text className="text-[#b3b3b3] text-sm">{i18n.t("cancel")}</Text>
                        </TouchableOpacity>
                    </View>

                    {feedbackSent ? (
                        <View className="flex-1 justify-center items-center gap-4">
                            <Text className="text-5xl">🎉</Text>
                            <Text className="text-white text-lg font-bold">{i18n.t("whispaSent")}</Text>
                        </View>
                    ) : (
                        <>
                            <Text className="text-[#b3b3b3] text-sm mb-3">
                                {i18n.t("whispaAnonymous")}
                            </Text>
                            <TextInput
                                className="bg-[#1a1a1a] text-white px-4 py-4 rounded-2xl border border-[#282828] mb-4"
                                placeholder={i18n.t("writeWhispaPlaceholder")}
                                placeholderTextColor="#555"
                                value={feedbackText}
                                onChangeText={(v) => { setFeedbackText(v); setFeedbackError(""); }}
                                multiline
                                numberOfLines={5}
                                maxLength={200}
                                textAlignVertical="top"
                            />
                            <Text className="text-[#555] text-xs text-right mb-2">
                                {feedbackText.length}/200
                            </Text>
                            {feedbackError ? (
                                <Text className="text-red-500 text-xs mb-3">{feedbackError}</Text>
                            ) : null}
                            <TouchableOpacity
                                onPress={handleSendFeedback}
                                disabled={feedbackLoading || !feedbackText.trim()}
                                className="bg-white rounded-full py-4 items-center mt-2"
                            >
                                {feedbackLoading ? (
                                    <ActivityIndicator color="black" />
                                ) : (
                                    <Text className="text-black font-bold text-base">{i18n.t("send")}</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </Modal>

            {/* Back Button */}
            <TouchableOpacity onPress={() => router.push("/(tabs)/search")} className="px-6 py-4">
                <Text className="text-[#b3b3b3] text-base">{i18n.t("back")}</Text>
            </TouchableOpacity>

            <FlatList
                data={[]}
                keyExtractor={() => "key"}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
                ListHeaderComponent={() => (
                    <View className="px-6">

                        {/* Avatar */}
                        <View className="items-center mt-4 mb-6">
                            <TouchableOpacity
                                onPress={() => setAvatarModalVisible(true)}
                                className="mb-4"
                            >
                                <View className="w-24 h-24 rounded-full bg-[#1a1a1a] border border-[#282828] justify-center items-center">
                                    {user.avatarUrl ? (
                                        <Image
                                            source={{ uri: user.avatarUrl }}
                                            className="w-24 h-24 rounded-full"
                                        />
                                    ) : (
                                        <Text className="text-white text-4xl font-bold">
                                            {user.username[0].toUpperCase()}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                            <Text className="text-white text-xl font-bold mb-1">
                                @{user.username}
                            </Text>
                            {user.bio ? (
                                <Text className="text-[#b3b3b3] text-sm text-center px-8">
                                    {user.bio}
                                </Text>
                            ) : null}
                        </View>

                        {/* Stats */}
                        <View className="flex-row justify-center gap-10 mb-6">
                            {user.showFollowers !== false && (
                                <View className="items-center">
                                    <Text className="text-white text-lg font-bold">
                                        {user.followers?.length ?? 0}
                                    </Text>
                                    <Text className="text-[#b3b3b3] text-sm">{i18n.t("followers")}</Text>
                                </View>
                            )}
                            {user.showFollowing !== false && (
                                <View className="items-center">
                                    <Text className="text-white text-lg font-bold">
                                        {user.following?.length ?? 0}
                                    </Text>
                                    <Text className="text-[#b3b3b3] text-sm">{i18n.t("following")}</Text>
                                </View>
                            )}
                        </View>

                        {/* Follow Button */}
                        {clerkUser?.username !== user.username && (
                            <TouchableOpacity
                                onPress={handleToggleFollow}
                                className={`rounded-full py-3 items-center mb-4 ${isFollowing ? "bg-[#1a1a1a] border border-[#282828]" : "bg-white"}`}
                            >
                                <Text className={`font-bold text-base ${isFollowing ? "text-white" : "text-black"}`}>
                                    {isFollowing ? i18n.t("unfollow") : i18n.t("follow")}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Send Whispa */}
                        {!user.isAcceptingFeedback ? (
                            <View className="bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4 items-center gap-2">
                                <Text className="text-[#555] font-semibold text-base text-center">
                                    {i18n.t("inboxClosed")}
                                </Text>
                            </View>
                        ) : canWhispa ? (
                            <TouchableOpacity
                                onPress={() => setFeedbackModalVisible(true)}
                                className="bg-[#1a1a1a] border border-[#282828] rounded-full py-3 items-center"
                            >
                                <Text className="text-white font-semibold text-base">
                                    {i18n.t("sendAnonymousWhispa")}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View className="bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4 items-center gap-2">
                                <Text className="text-[#555] font-semibold text-base text-center">
                                    {i18n.t("userDoesntFollowBack")}
                                </Text>
                            </View>
                        )}

                    </View>
                )}
                renderItem={() => null}
            />
        </View>
    );
}