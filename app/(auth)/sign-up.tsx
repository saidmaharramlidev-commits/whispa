import i18n from "@/lib/i18n";
import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [code, setCode] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    // reset any stale incomplete sign-up from a previous app session
    useEffect(() => {
        if (
            signUp.status === "missing_requirements"
        ) {
            signUp.reset();
        }
    }, []);

    const handleSubmit = async () => {
        setErrorMessage("");
        try {
            if (!/^[\x20-\x7E]+$/.test(password)) {
                setErrorMessage(i18n.t("passwordInvalidChars"));
                return;
            }
            const { error } = await signUp.create({ emailAddress, password, username });
            if (error) {
                setErrorMessage(error.message);
                return;
            }
            await signUp.verifications.sendEmailCode();
        } catch (err: any) {
            setErrorMessage(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || i18n.t("somethingWentWrong"));
        }
    };

    const handleVerify = async () => {
        setErrorMessage("");
        try {
            const { error } = await signUp.verifications.verifyEmailCode({ code });
            if (error) {
                setErrorMessage(error.message);
                return;
            }

            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/sync`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clerkId: signUp.createdUserId,
                        username,
                        email: emailAddress,
                    }),
                });
                const data = await response.json();
            } catch (err) {
                console.error("Failed to sync user:", err);
            }

            await signUp.finalize();
            router.replace("/(tabs)" as any);
        } catch (err: any) {
            setErrorMessage(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || i18n.t("invalidCode"));
        }
    };

    const handleStartOver = () => {
        signUp.reset();
        setEmailAddress("");
        setPassword("");
        setUsername("");
        setCode("");
        setErrorMessage("");
    };

    if (signUp.status === "complete" || isSignedIn) return null;

    // VERIFY SCREEN
    if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0
    ) {
        return (
            <View className="flex-1 bg-black px-6" style={{ paddingTop: insets.top + 48 }}>
                <View className="items-center mb-10">
                    <Text className="text-white text-3xl font-bold tracking-widest">{i18n.t("appName")}</Text>
                    <Text className="text-[#555] text-sm mt-2">{i18n.t("checkYourCode")}</Text>
                </View>

                <View className="bg-[#111] border border-[#282828] rounded-3xl p-6">
                    <Text className="text-[#888] text-xs tracking-widest uppercase mb-2">{i18n.t("code")}</Text>
                    <TextInput
                        className="bg-black border border-[#282828] rounded-xl px-4 py-4 text-white text-base"
                        placeholder={i18n.t("codePlaceholder")}
                        placeholderTextColor="#444"
                        value={code}
                        onChangeText={(v) => { setCode(v); setErrorMessage(""); }}
                        keyboardType="numeric"
                    />

                    {errorMessage ? (
                        <Text className="text-red-500 text-xs mt-2">{errorMessage}</Text>
                    ) : null}

                    <Pressable
                        className="bg-[#1DB954] rounded-full py-4 items-center mt-5"
                        onPress={handleVerify}
                        disabled={fetchStatus === "fetching"}
                    >
                        <Text className="text-black font-bold text-base tracking-wide">
                            {fetchStatus === "fetching" ? i18n.t("verifying") : i18n.t("verify")}
                        </Text>
                    </Pressable>

                    <Pressable
                        className="mt-3 border border-[#282828] rounded-full py-4 items-center"
                        onPress={() => signUp.verifications.sendEmailCode()}
                    >
                        <Text className="text-[#888] text-sm">{i18n.t("resendCode")}</Text>
                    </Pressable>

                    <Pressable
                        className="mt-3 border border-[#282828] rounded-full py-4 items-center"
                        onPress={handleStartOver}
                    >
                        <Text className="text-[#888] text-sm">{i18n.t("startOver")}</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    // SIGN UP SCREEN
    return (
        <View className="flex-1 bg-black px-6" style={{ paddingTop: insets.top + 32 }}>

            {/* Brand */}
            <View className="items-center mb-8">
                <View className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#282828] items-center justify-center mb-4">
                    <Text className="text-[#1DB954] text-2xl">💬</Text>
                </View>
                <Text className="text-white text-3xl font-bold tracking-widest">{i18n.t("appName")}</Text>
                <Text className="text-[#555] text-sm mt-2">{i18n.t("createAccount")}</Text>
                <View className="flex-row items-center gap-2 bg-[#1a1a1a] border border-[#282828] rounded-full px-4 py-2 mt-3">
                    <View className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                    <Text className="text-[#888] text-xs">{i18n.t("appAnonymousBadge")}</Text>
                </View>
            </View>

            {/* Card */}
            <View className="bg-[#111] border border-[#282828] rounded-3xl p-6">

                <Text className="text-[#888] text-xs tracking-widest uppercase mb-2">{i18n.t("username")}</Text>
                <TextInput
                    className="bg-black border border-[#282828] rounded-xl px-4 py-4 text-white text-base mb-5"
                    placeholder={i18n.t("usernamePlaceholder")}
                    placeholderTextColor="#444"
                    value={username}
                    onChangeText={(v) => { setUsername(v); setErrorMessage(""); }}
                    autoCapitalize="none"
                />

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
                    disabled={!emailAddress || !password || !username || fetchStatus === "fetching"}
                >
                    <Text className="text-black font-bold text-base tracking-wide">
                        {fetchStatus === "fetching" ? i18n.t("creatingAccount") : i18n.t("signUp")}
                    </Text>
                </Pressable>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-6 gap-1">
                <Text className="text-[#555]">{i18n.t("alreadyHaveAccount")}</Text>
                <Link href="/(auth)/sign-in">
                    <Text className="text-white font-semibold">{i18n.t("signIn")}</Text>
                </Link>
            </View>

            <View nativeID="clerk-captcha" />
        </View>
    );
}