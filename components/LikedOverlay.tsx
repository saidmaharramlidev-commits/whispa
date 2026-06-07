import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Feedback = { _id: string; text: string };
type Props = { likedFeedbacks: Feedback[]; onClose: () => void; onUnlike: (id: string) => void };

export default function LikedOverlay({ likedFeedbacks, onClose, onUnlike }: Props) {
    const insets = useSafeAreaInsets();
    const api = useApi();

    const handleUnlike = async (id: string) => {
        onUnlike(id);
        try {
            await api.deleteFeedback(id);
        } catch (err) {
            console.error("Failed to delete feedback:", err);
        }
    };

    return (
        <View
            className="absolute top-0 left-0 right-0 bottom-0 bg-black z-50 px-6"
            style={{ paddingTop: insets.top }}
        >
            <View className="flex-row justify-between items-center my-6">
                <Text className="text-white text-xl font-bold">{i18n.t("likedWhispas")}</Text>
                <TouchableOpacity
                    onPress={onClose}
                    className="bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#282828]"
                >
                    <Text className="text-[#b3b3b3] text-sm">{i18n.t("close")}</Text>
                </TouchableOpacity>
            </View>

            {likedFeedbacks.length === 0 ? (
                <View className="flex-1 justify-center items-center gap-4">
                    <Text className="text-5xl">❤️</Text>
                    <Text className="text-white text-lg font-bold">{i18n.t("noLikedWhispas")}</Text>
                    <Text className="text-[#b3b3b3] text-sm text-center px-8">
                        {i18n.t("likeWhispasToSee")}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={likedFeedbacks}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
                    renderItem={({ item }) => (
                        <View className="bg-[#111] rounded-2xl p-5 mb-3 border border-[#282828]">
                            <View className="flex-row items-start gap-3">
                                <Text className="text-white text-base leading-6 flex-1">{item.text}</Text>
                                <TouchableOpacity
                                    onPress={() => handleUnlike(item._id)}
                                    className="bg-[#1a1a1a] rounded-full p-1.5 border border-[#282828] mt-0.5"
                                    style={{ alignSelf: "flex-start" }}
                                >
                                    <Ionicons name="close" size={14} color="#555" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}