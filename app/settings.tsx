import { useApi } from "@/lib/api";
import i18n from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth, useClerk } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Modal, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);

    // contact modal state
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactMessage, setContactMessage] = useState("");
    const [contactSending, setContactSending] = useState(false);
    const [contactSent, setContactSent] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await api.getMe();
                setIsAcceptingFeedback(data.data.isAcceptingFeedback);
                setShowFollowers(data.data.showFollowers);
                setShowFollowing(data.data.showFollowing);
                setFollowersOnly(data.data.followersOnly);
                setUser({ username: data.data.username, email: data.data.email });
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

    const handleContact = async () => {
        if (!contactMessage.trim()) return;
        try {
            setContactSending(true);

            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID,
                    template_id: process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID,
                    user_id: process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY,
                    accessToken: process.env.EXPO_PUBLIC_EMAILJS_PRIVATE_KEY,
                    template_params: {
                        name: user?.username || 'Whispa User',
                        surname: '',
                        email: user?.email || '',
                        time: new Date().toLocaleString(),
                        message: contactMessage,
                    },
                }),
            });

            const text = await response.text();

            if (!response.ok) {
                console.error('EmailJS failed:', text);
                return;
            }

            setContactSent(true);
            setContactMessage('');
            setTimeout(() => {
                setShowContactModal(false);
                setContactSent(false);
            }, 1500);

        } catch (err) {
            console.error('EmailJS error:', err);
        } finally {
            setContactSending(false);
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

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 16,
                    paddingBottom: insets.bottom + 30,
                    rowGap: 12,
                }}
                showsVerticalScrollIndicator={false}
            >

                {/* Language */}
                <TouchableOpacity
                    className="flex-row justify-between items-center bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4"
                    onPress={() => changeLanguage(locale === "en" ? "az" : "en")}
                >
                    <View className="flex-row items-center gap-3">
                        <Ionicons name="language-outline" size={18} color="#b3b3b3" />
                        <Text className="text-white font-semibold">{i18n.t("language")}</Text>
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

                {/* Contact */}
                <TouchableOpacity
                    onPress={() => setShowContactModal(true)}
                    className="flex-row items-center gap-3 bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4"
                >
                    <Ionicons name="mail-outline" size={18} color="#b3b3b3" />
                    <Text className="text-white font-semibold">{i18n.t("contactUs")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center gap-3 bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4"
                    onPress={() =>
                        Linking.openURL("https://doc-hosting.flycricket.io/whispa-privacy-policy/e20b60d9-e6ed-4e95-909f-93cd582ede47/privacy")
                    }
                >
                    <View>
                        <Text className="text-white font-semibold">Privacy Policy</Text>
                        <Text className='text-sm mt-2 text-gray-400'>
                            View how your data is collected and used
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center gap-3 bg-[#1a1a1a] border border-[#282828] rounded-2xl px-5 py-4"
                    onPress={() =>
                        Linking.openURL("https://doc-hosting.flycricket.io/whispa-terms-of-use/6ba7661d-876d-406c-9514-2530ab0fa5c9/terms")
                    }
                >
                    <View>
                        <Text className="text-white font-semibold">Terms of Service</Text>
                        <Text className='text-sm mt-2 text-gray-400'>
                            Read the terms for using WhispaMe
                        </Text>
                    </View>
                </TouchableOpacity>

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

            </ScrollView>

            {/* Contact Modal */}
            <Modal
                visible={showContactModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowContactModal(false)}
            >
                <View className="flex-1 bg-black px-6 pt-8">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-white text-xl font-bold">{i18n.t("contactUs")}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setShowContactModal(false);
                                setContactMessage('');
                                setContactSent(false);
                            }}
                            className="bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#282828]"
                        >
                            <Text className="text-[#b3b3b3] text-sm">{i18n.t("cancel")}</Text>
                        </TouchableOpacity>
                    </View>

                    {contactSent ? (
                        <View className="flex-1 justify-center items-center gap-4">
                            <Text className="text-4xl">✅</Text>
                            <Text className="text-white text-lg font-bold">{i18n.t("messageSent")}</Text>
                        </View>
                    ) : (
                        <>
                            <Text className="text-[#b3b3b3] text-sm mb-3">
                                {i18n.t("contactDesc")}
                            </Text>
                            <TextInput
                                className="bg-[#1a1a1a] text-white px-4 py-4 rounded-2xl border border-[#282828] mb-3"
                                placeholder={i18n.t("contactPlaceholder")}
                                placeholderTextColor="#555"
                                value={contactMessage}
                                onChangeText={setContactMessage}
                                multiline
                                numberOfLines={6}
                                maxLength={1000}
                                textAlignVertical="top"
                            />
                            <Text className="text-[#555] text-xs text-right mb-4">
                                {contactMessage.length}/1000
                            </Text>
                            <Pressable
                                onPress={handleContact}
                                disabled={contactSending || !contactMessage.trim()}
                                className="bg-white rounded-full py-4 items-center"
                            >
                                {contactSending ? (
                                    <ActivityIndicator color="black" />
                                ) : (
                                    <Text className="text-black font-bold text-base">{i18n.t("send")}</Text>
                                )}
                            </Pressable>
                        </>
                    )}
                </View>
            </Modal>

        </View>
    );
}