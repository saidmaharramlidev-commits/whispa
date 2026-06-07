import UserCardFollow from "@/components/UserCardFollow";
import i18n from "@/lib/i18n";
import { useUser } from "@clerk/expo";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type User = {
    _id: string;
    username: string;
    bio: string;
};

type Props = {
    visible: boolean;
    type: "followers" | "following";
    users: User[];
    currentUserFollowing: string[];
    onClose: () => void;
    onFollowToggle?: () => void;
};

export default function FollowListModal({ visible, type, users, currentUserFollowing, onClose, onFollowToggle }: Props) {
    const insets = useSafeAreaInsets();
    const { user: clerkUser } = useUser();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>

                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-4 border-b border-[#1a1a1a]">
                    <Text className="text-white text-xl font-bold">
                        {type === "followers" ? i18n.t("followers") : i18n.t("following")}
                    </Text>
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#282828]"
                    >
                        <Text className="text-[#b3b3b3] text-sm">{i18n.t("close")}</Text>
                    </TouchableOpacity>
                </View>

                {/* List */}
                {users.length === 0 ? (
                    <View className="flex-1 justify-center items-center gap-4">
                        <Text className="text-4xl">
                            {type === "followers" ? "👥" : "🔍"}
                        </Text>
                        <Text className="text-white text-lg font-bold">
                            {type === "followers" ? i18n.t("noFollowersYet") : i18n.t("notFollowingAnyone")}
                        </Text>
                        <Text className="text-[#b3b3b3] text-sm text-center px-10">
                            {type === "followers"
                                ? i18n.t("shareProfileForFollowers")
                                : i18n.t("searchForPeopleToFollow")}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 80 }}
                        renderItem={({ item }) => (
                            <UserCardFollow
                                user={{
                                    ...item,
                                    avatarUrl: "",
                                    isFollowing: currentUserFollowing.some(
                                        (id: any) => id.toString() === item._id.toString()
                                    ),
                                }}
                                onClose={onClose}
                                onFollowToggle={onFollowToggle}
                            />
                        )}
                    />
                )}
            </View>
        </Modal>
    );
}