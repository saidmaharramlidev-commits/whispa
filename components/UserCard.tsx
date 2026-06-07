import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type User = {
    _id: string;
    username: string;
    bio: string;
    avatarUrl: string;
};

type Props = {
    user: User;
};

export default function UserCard({ user }: Props) {
    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "/user/[username]",
                params: { username: user.username }
            })}
            className="flex-row items-center gap-4 py-4 border-b border-[#1a1a1a]"
        >
            {/* Avatar */}
            <View className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#282828] justify-center items-center">
                {user.avatarUrl ? (
                    <Image
                        source={{ uri: user.avatarUrl }}
                        className="w-12 h-12 rounded-full"
                    />
                ) : (
                    <Text className="text-white text-lg font-bold">
                        {user.username[0].toUpperCase()}
                    </Text>
                )}
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                    {user.username}
                </Text>
                {user.bio ? (
                    <Text className="text-[#b3b3b3] text-sm" numberOfLines={1}>
                        {user.bio}
                    </Text>
                ) : null}
            </View>

            {/* Arrow */}
            <Text className="text-[#555] text-lg">›</Text>
        </TouchableOpacity>
    );
}