import { registerForPushNotificationsAsync } from "@/lib/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface NotificationContextType {
    expoPushToken: string | null;
    devicePushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
    permissionDenied: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [devicePushToken, setDevicePushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        registerForPushNotificationsAsync().then(
            (token) => {
                if (token) {
                    setExpoPushToken(token);
                } else {
                    setPermissionDenied(true); // ← null means denied
                }
            },
            (error) => setError(error),
        );

        Notifications.getDevicePushTokenAsync().then(
            (devicePushToken) => setDevicePushToken(devicePushToken.data),
            (error) => setError(error),
        );

        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => setNotification(notification)
        );

        const responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const title = response.notification.request.content.title;
                if (title === "New Follower 🎉") {
                    router.push("/(tabs)/profile" as any);
                }
                if (title === "New Whispa 💬") {
                    router.push("/(tabs)" as any);
                }
            }
        );

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{
            expoPushToken,
            devicePushToken,
            notification,
            error,
            permissionDenied
        }}>
            {children}
        </NotificationContext.Provider>
    );
};