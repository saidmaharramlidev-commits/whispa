import i18n from "@/lib/i18n";
import { Text, View } from "react-native";

type Props = {
    text: string;
};

export default function FeedbackCard({ text }: Props) {
    return (
        <View className="w-full rounded-3xl border border-[#1DB954]/20 bg-[#0a0a0a]" style={{ minHeight: 280 }}>

            {/* Text content */}
            <View className="px-8 py-6 flex-1 justify-center" style={{ minHeight: 180 }}>
                <Text className="text-white text-xl text-center leading-9 tracking-wide">
                    {text}
                </Text>
            </View>

            {/* Bottom */}
            <View className="flex-row justify-between items-center px-8 pb-8">
                <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#1DB954]" />
                    <Text className="text-[#1DB954] text-xs tracking-widest uppercase font-semibold">
                        {i18n.t("appName").toLowerCase()}
                    </Text>
                </View>
                <View className="bg-[#1a1a1a] border border-[#282828] px-3 py-1 rounded-full">
                    <Text className="text-[#555] text-xs tracking-wider uppercase">
                        {i18n.t("anonymous")}
                    </Text>
                </View>
            </View>

        </View>
    );
}