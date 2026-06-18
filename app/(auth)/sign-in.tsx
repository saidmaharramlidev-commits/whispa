import i18n from "@/lib/i18n";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
    const { signIn, fetchStatus } = useSignIn();
    const insets = useSafeAreaInsets();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = async () => {
        setErrorMessage("");
        try {
            const { error } = await signIn.password({ emailAddress, password });
            if (error) {
                setErrorMessage(error.message);
                return;
            }

            if (signIn.status === "complete") {
                await signIn.finalize();
                // (auth)/_layout.tsx handles redirect via isSignedIn change
            } else {
                setErrorMessage(i18n.t("invalidEmailOrPassword"));
            }
        } catch (err: any) {
            setErrorMessage(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || i18n.t("invalidEmailOrPassword"));
        }
    };

    // SIGN IN SCREEN
    return (
        <View className="flex-1 bg-black px-6" style={{ paddingTop: insets.top + 48 }}>

            {/* Brand */}
            <View className="items-center mb-10">
                <View className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#282828] items-center justify-center mb-4">
                    <Text className="text-[#1DB954] text-2xl">💬</Text>
                </View>
                <Text className="text-white text-3xl font-bold tracking-widest">{i18n.t("appName")}</Text>
                <Text className="text-[#555] text-sm mt-2">{i18n.t("signInWelcome")}</Text>
                <View className="flex-row items-center gap-2 bg-[#1a1a1a] border border-[#282828] rounded-full px-4 py-2 mt-3">
                    <View className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                    <Text className="text-[#888] text-xs">{i18n.t("appAnonymousBadge")}</Text>
                </View>
            </View>

            {/* Card */}
            <View className="bg-[#111] border border-[#282828] rounded-3xl p-6">

                <Text className="text-[#888] text-xs tracking-widest uppercase mb-2">{i18n.t("email")}</Text>
                <TextInput
                    className="bg-black border border-[#282828] rounded-xl px-4 py-4 text-white text-base mb-5"
                    placeholder={i18n.t("emailPlaceholder")}
                    placeholderTextColor="#444"
                    value={emailAddress}
                    onChangeText={(v) => { setEmailAddress(v); setErrorMessage(""); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text className="text-[#888] text-xs tracking-widest uppercase mb-2">{i18n.t("password")}</Text>
                <View className="relative">
                    <TextInput
                        className="bg-black border border-[#282828] rounded-xl px-4 py-4 text-white text-base pr-12"
                        placeholder={i18n.t("passwordPlaceholder")}
                        placeholderTextColor="#444"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(v) => { setPassword(v); setErrorMessage(""); }}
                    />
                    <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4"
                    >
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#555" />
                    </Pressable>
                </View>

                {errorMessage ? (
                    <Text className="text-red-500 text-xs mt-3">{errorMessage}</Text>
                ) : null}

                <Pressable
                    className="bg-[#1DB954] rounded-full py-4 items-center mt-6"
                    onPress={handleSubmit}
                    disabled={!emailAddress || !password || fetchStatus === "fetching"}
                >
                    <Text className="text-black font-bold text-base tracking-wide">
                        {fetchStatus === "fetching" ? i18n.t("signingIn") : i18n.t("continue")}
                    </Text>
                </Pressable>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-6 gap-1">
                <Text className="text-[#555]">{i18n.t("noAccount")}</Text>
                <Link href="/(auth)/sign-up">
                    <Text className="text-white font-semibold">{i18n.t("signUp")}</Text>
                </Link>
            </View>

        </View>
    );
}