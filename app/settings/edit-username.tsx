import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditUsernameScreen() {
    const insets = useSafeAreaInsets();
    const api = useApi();

    const [username, setUsername] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!username.trim()) {
            setError(i18n.t("usernameCannotBeEmpty"));
            return;
        }
        try {
            setSaving(true);
            setError("");
            await api.updateMe({ username: username.trim() });
            router.back();
        } catch (err: any) {
            setError(err.message || i18n.t("failedToUpdateUsername"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="#b3b3b3" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">{i18n.t("editUsernameTitle")}</Text>
                </View>
                {saving && <ActivityIndicator size="small" color="#1DB954" />}
            </View>

            <View className="px-6 mt-4">
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder={i18n.t("newUsernamePlaceholder")}
                    placeholderTextColor="#555"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                    className="bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4 text-white text-base"
                />
                {error ? (
                    <Text className="text-red-500 text-sm mt-2 px-1">{error}</Text>
                ) : null}

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className="bg-[#1DB954] rounded-full py-4 items-center mt-4"
                >
                    <Text className="text-black font-bold text-base">{i18n.t("save")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}