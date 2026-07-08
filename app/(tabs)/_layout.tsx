import i18n from "@/lib/i18n";
import { useLanguage } from "@/lib/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";



export default function TabsLayout() {
    const { locale } = useLanguage();
    const insets = useSafeAreaInsets();






    return (
        <Tabs


            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#999",
                tabBarStyle: {
                    backgroundColor: "#1e1e1e",
                    borderTopWidth: 0,
                    borderTopColor: "black",
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 55 + insets.bottom,
                    paddingBottom: insets.bottom || 10,
                    borderRadius: 30,
                    position: "absolute",
                    width: "95%",
                    bottom: 20,
                    alignSelf: "center",
                    marginHorizontal: 10,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: i18n.t("home"),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: i18n.t("search"),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: i18n.t("profile"),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}