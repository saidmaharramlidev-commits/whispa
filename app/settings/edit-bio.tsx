import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditBioScreen() {
    const insets = useSafeAreaInsets();
    const api = useApi();

    const [bio, setBio] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBio = async () => {
            try {
                const data = await api.getMe();
                setBio(data.data.bio || "");
            } catch (err) {
                console.error("Failed to fetch bio:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBio();
    }, []);

    const handleSave = async () => {
        if (bio.length > 160) {
            setError(i18n.t("bioTooLong"));
            return;
        }
        try {
            setSaving(true);
            setError("");
            await api.updateMe({ bio: bio.trim() });
            router.back();
        } catch (err: any) {
            setError(err.message || i18n.t("failedToUpdateBio"));
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#1DB954" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color="#b3b3b3" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">{i18n.t("editBioTitle")}</Text>
                </View>
                {saving && <ActivityIndicator size="small" color="#1DB954" />}
            </View>

            <View className="px-6 mt-4">
                <TextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder={i18n.t("bioPlaceholder")}
                    placeholderTextColor="#555"
                    multiline
                    maxLength={160}
                    autoFocus
                    className="bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4 text-white text-base"
                    style={{ minHeight: 120, textAlignVertical: "top" }}
                />
                <Text className="text-[#555] text-xs mt-2 text-right">{bio.length}/160</Text>

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