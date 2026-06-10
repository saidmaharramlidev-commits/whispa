import { registerForPushNotificationsAsync } from "@/lib/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
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

    useEffect(() => {
        // get expo push token
        registerForPushNotificationsAsync().then(
            (token) => setExpoPushToken(token),
            (error) => setError(error),
        );

        // get device push token
        Notifications.getDevicePushTokenAsync().then(
            (devicePushToken) => setDevicePushToken(devicePushToken.data),
            (error) => setError(error),
        );

        // listen for notifications
        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("🔔 Notification Received:", notification);
                setNotification(notification);
            }
        );

        const responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log("🔔 Notification Response:", response);
            }
        );

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ expoPushToken, devicePushToken, notification, error }}>
            {children}
        </NotificationContext.Provider>
    );
};