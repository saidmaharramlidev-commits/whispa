import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    onLike: () => void;
    onDelete: () => void;
};

export default function ActionButtons({ onLike, onDelete }: Props) {
    return (
        <View className="flex-row gap-12 mt-8">
            <TouchableOpacity
                onPress={onDelete}
                className="w-16 h-16 rounded-full bg-[#1a1a1a] justify-center items-center border border-[#282828]"
            >
                <Text className="text-2xl">🗑️</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onLike}
                className="w-16 h-16 rounded-full bg-[#1a1a1a] justify-center items-center border border-[#282828]"
            >
                <Text className="text-2xl">❤️</Text>
            </TouchableOpacity>
        </View>
    );
}