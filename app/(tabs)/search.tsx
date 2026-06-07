import UserCard from "@/components/UserCard";
import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type User = {
    _id: string;
    username: string;
    bio: string;
    avatarUrl: string;
};

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const api = useApi();

    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (query.length === 0) {
            setUsers([]);
            setSearched(false);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);
                setSearched(true);
                const data = await api.searchUsers(query);
                setUsers(data.data);
            } catch (err) {
                console.error("Failed to search users:", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>

            {/* Header */}
            <View className="px-6 py-4">
                <Text className="text-white text-2xl font-bold tracking-wider mb-4">
                    {i18n.t("search")}
                </Text>
                <TextInput
                    className="bg-[#1a1a1a] text-white px-4 py-3 rounded-2xl border border-[#282828]"
                    placeholder={i18n.t("searchPlaceholder")}
                    placeholderTextColor="#555"
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                />
            </View>

            {/* Results */}
            {query.length === 0 ? (
                <View className="flex-1 justify-center items-center gap-4">
                    <Text className="text-4xl">🔍</Text>
                    <Text className="text-white text-lg font-bold">{i18n.t("findPeople")}</Text>
                    <Text className="text-[#b3b3b3] text-sm text-center px-10">
                        {i18n.t("searchByUsername")}
                    </Text>
                </View>
            ) : loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#1DB954" />
                </View>
            ) : searched && users.length === 0 ? (
                <View className="flex-1 justify-center items-center gap-4">
                    <Text className="text-4xl">😕</Text>
                    <Text className="text-white text-lg font-bold">{i18n.t("noUsersFound")}</Text>
                    <Text className="text-[#b3b3b3] text-sm">{i18n.t("tryDifferentUsername")}</Text>
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 80 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <UserCard user={item} />}
                />
            )}
        </View>
    );
}