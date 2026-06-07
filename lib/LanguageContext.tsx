import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import i18n from "./i18n";

type LanguageContextType = {
    locale: string;
    changeLanguage: (lang: "en" | "az") => void;
};

const LanguageContext = createContext<LanguageContextType>({
    locale: "en",
    changeLanguage: () => { },
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = useState("en");

    useEffect(() => {
        AsyncStorage.getItem("language").then(lang => {
            if (lang) {
                i18n.locale = lang;
                setLocale(lang);
            }
        });
    }, []);

    const changeLanguage = async (lang: "en" | "az") => {
        i18n.locale = lang;
        setLocale(lang);
        await AsyncStorage.setItem("language", lang);
    };

    return (
        <LanguageContext.Provider value={{ locale, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);