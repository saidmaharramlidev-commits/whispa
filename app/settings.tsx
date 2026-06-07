import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth, useClerk } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const { signOut } = useClerk();
    const { isLoaded } = useAuth();
    const api = useApi();
    const { locale, changeLanguage } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAcceptingFeedback, setIsAcceptingFeedback] = useState(true);
    const [showFollowers, setShowFollowers] = useState(true);
    const [showFollowing, setShowFollowing] = useState(true);
    const [followersOnly, setFollowersOnly] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await api.getMe();
                setIsAcceptingFeedback(data.data.isAcceptingFeedback);
                setShowFollowers(data.data.showFollowers);
                setShowFollowing(data.data.showFollowing);
                setFollowersOnly(data.data.followersOnly);
            } catch (err) {
                console.error("Failed to load user settings:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) fetchUser();
    }, [isLoaded]);

    const handleUpdate = async (updates: object) => {
        try {
            setSaving(true);
            await api.updateMe(updates);
        } catch (err) {
            console.error("Failed to update:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleFeedback = (value: boolean) => {
        setIsAcceptingFeedback(value);
        handleUpdate({ isAcceptingFeedback: value });
    };

    const handleToggleShowFollowers = (value: boolean) => {
        setShowFollowers(value);
        handleUpdate({ showFollowers: value });
    };

    const handleToggleShowFollowing = (value: boolean) => {
        setShowFollowing(value);
        handleUpdate({ showFollowing: value });
    };

    const handleToggleFollowersOnly = (value: boolean) => {
        setFollowersOnly(value);
        handleUpdate({ followersOnly: value });
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace("/(auth)/sign-in" as any);
        } catch (err) {
            console.error("Sign out error:", err);
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
                    <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
                        <Ionicons name="arrow-back" size={22} color="#b3b3b3" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">{i18n.t("settings")}</Text>
                </View>
                {saving && <ActivityIndicator size="small" color="#1DB954" />}
            </View>

            <View className="px-6 mt-4 gap-3">
                {/* Language */}
                <TouchableOpacity
                    className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4"
                    onPress={() => changeLanguage(locale === "en" ? "az" : "en")}
                >
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="language-outline" size={18} color="#b3b3b3" />
                        <Text className="text-white font-semibold">Language</Text>
                    </View>
                    <Text className="text-[#b3b3b3] text-sm">
                        {locale === "en" ? "🇬🇧 English" : "🇦🇿 Azərbaycan"}
                    </Text>
                </TouchableOpacity>

                {/* Edit Username */}
                <TouchableOpacity
                    className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4"
                    onPress={() => router.push("/settings/edit-username")}
                >
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="person-outline" size={18} color="#b3b3b3" />
                        <Text className="text-white font-semibold">{i18n.t("editUsername")}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#555" />
                </TouchableOpacity>

                {/* Edit Bio */}
                <TouchableOpacity
                    className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4"
                    onPress={() => router.push("/settings/edit-bio")}
                >
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="create-outline" size={18} color="#b3b3b3" />
                        <Text className="text-white font-semibold">{i18n.t("editBio")}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#555" />
                </TouchableOpacity>

                {/* Accept Whispas Toggle */}
                <View className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4">
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="chatbubble-outline" size={18} color="#b3b3b3" />
                        <Text className="text-white font-semibold">{i18n.t("acceptWhispas")}</Text>
                    </View>
                    <Switch
                        value={isAcceptingFeedback}
                        onValueChange={handleToggleFeedback}
                        trackColor={{ false: "#282828", true: "#1DB954" }}
                        thumbColor="white"
                    />
                </View>

                {/* Followers Only Toggle */}
                <View className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4">
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="lock-closed-outline" size={18} color="#b3b3b3" />
                        <View>
                            <Text className="text-white font-semibold">{i18n.t("followersOnly")}</Text>
                            <Text className="text-[#555] text-xs mt-0.5">{i18n.t("followersOnlyDesc")}</Text>
                        </View>
                    </View>
                    <Switch
                        value={followersOnly}
                        onValueChange={handleToggleFollowersOnly}
                        trackColor={{ false: "#282828", true: "#1DB954" }}
                        thumbColor="white"
                    />
                </View>

                {/* Show Followers Toggle */}
                <View className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4">
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="people-outline" size={18} color="#b3b3b3" />
                        <Text className="text-white font-semibold">{i18n.t("showFollowers")}</Text>
                    </View>
                    <Switch
                        value={showFollowers}
                        onValueChange={handleToggleShowFollowers}
                        trackColor={{ false: "#282828", true: "#1DB954" }}
                        thumbColor="white"
                    />
                </View>

                {/* Show Following Toggle */}
                <View className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4">
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="person-add-outline" size={18} color="#b3b3b3" />
                        <Text className="text-white font-semibold">{i18n.t("showFollowing")}</Text>
                    </View>
                    <Switch
                        value={showFollowing}
                        onValueChange={handleToggleShowFollowing}
                        trackColor={{ false: "#282828", true: "#1DB954" }}
                        thumbColor="white"
                    />
                </View>

                {/* Sign Out */}
                <TouchableOpacity
                    onPress={handleSignOut}
                    className="flex-row items-center gap-3 bg-[#1a1a1a] border border-red-900 rounded-2xl px-5 py-4 mt-4"
                >
                    <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                    <Text className="text-red-500 font-semibold">{i18n.t("signOut")}</Text>
                </TouchableOpacity>

                {/* Version */}
                <View className="items-center mt-6">
                    <Text className="text-[#555] text-sm">
                        {i18n.t("appVersion")}{Constants.expoConfig?.version}
                    </Text>
                </View>

            </View>
        </View>
    );
}