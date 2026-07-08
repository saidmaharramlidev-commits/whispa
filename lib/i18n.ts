import { I18n } from "i18n-js";

const i18n = new I18n({
    en: {
        // App
        appName: "WhispaMe",
        appTagline: "anonymous feedback, honestly.",
        appAnonymousBadge: "100% anonymous messages",
        appVersion: "WhispaMe v",

        // Auth - Sign In
        signIn: "Sign in",
        signInWelcome: "Welcome Back.",
        signInVerifyIdentity: "verify your identity",
        email: "Email",
        emailPlaceholder: "you@example.com",
        password: "Password",
        passwordPlaceholder: "Enter a password",
        continue: "Continue",
        signingIn: "Signing in...",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        invalidEmailOrPassword: "Invalid email or password",

        // Auth - Sign Up
        createAccount: "Create Account",
        username: "Username",
        usernamePlaceholder: "Create a username",
        creatingAccount: "Creating account...",
        alreadyHaveAccount: "Already have an account?",
        passwordInvalidChars: "Password can only contain standard English letters, numbers, and symbols",
        somethingWentWrong: "Something went wrong",

        // Auth - Verify
        checkYourCode: "Check Your Code",
        code: "Code",
        codePlaceholder: "Enter verification code",
        verifyCodePlaceholder: "Enter code",
        verify: "Verify",
        verifying: "Verifying...",
        resendCode: "Resend code",
        startOver: "Start over",
        invalidCode: "Invalid code",

        // Tabs
        home: "Home",
        search: "Search",
        profile: "Profile",

        // Home Screen
        liked: "❤️ Liked",
        allCaughtUp: "You're all caught up",
        noMoreWhispas: "No more Whispa to review",

        // Liked Overlay
        likedWhispas: "Liked Whispas",
        close: "Close",
        noLikedWhispas: "No liked whispas",
        likeWhispasToSee: "Like whispas to see them here",

        // Search Screen
        searchPlaceholder: "Search users...",
        findPeople: "Find people",
        searchByUsername: "Search by username to send them a Whispa",
        noUsersFound: "No users found",
        tryDifferentUsername: "Try a different username",

        // Profile Screen
        followers: "Followers",
        following: "Following",
        editProfile: "Edit Profile",
        acceptingWhispas: "Accepting Whispas",
        onlyFollowersCanWhispa: "Only followers can Whispa you",
        everyoneCanWhispa: "Everyone can send you Whispas",
        failedToLoadProfile: "Failed to load profile",

        // User Profile Screen
        back: "← Back",
        follow: "Follow",
        unfollow: "Unfollow",
        sendAnonymousWhispa: "Send Anonymous Whispa",
        userNotFound: "User not found",
        whispasOff: "Whispas are turned off",
        userDoesntFollowBack: "🔒 User doesn't follow you back",
        inboxClosed: "User has turned off their inbox",

        // Send Whispa Modal
        sendWhispa: "Send Whispa",
        cancel: "Cancel",
        whispaAnonymous: "Your whispa is completely anonymous",
        writeWhispaPlaceholder: "Write your whispa...",
        send: "Send",
        whispaSent: "Whispa sent!",
        whispaTooShort: "Whispa must be at least 2 characters",

        // Settings Screen
        settings: "Settings",
        editUsername: "Edit Username",
        editBio: "Edit Bio",
        acceptWhispas: "Accept Whispas",
        followersOnly: "Followers Only",
        followersOnlyDesc: "Only followers can Whispa you",
        showFollowers: "Show Followers",
        showFollowing: "Show Following",
        signOut: "Sign Out",

        // Edit Username Screen
        editUsernameTitle: "Edit Username",
        newUsernamePlaceholder: "New username",
        usernameCannotBeEmpty: "Username cannot be empty",
        failedToUpdateUsername: "Failed to update username",
        save: "Save",

        // Edit Bio Screen
        editBioTitle: "Edit Bio",
        bioPlaceholder: "Write something about yourself...",
        bioTooLong: "Bio cannot exceed 160 characters",
        failedToUpdateBio: "Failed to update bio",

        // Follow Modal
        noFollowersYet: "No followers yet",
        notFollowingAnyone: "Not following anyone",
        shareProfileForFollowers: "Share your profile to get followers",
        searchForPeopleToFollow: "Search for people to follow",

        // FeedbackCard
        anonymous: "anonymous",

        // Permission
        galleryPermissionRequired: "Permission to access gallery is required",

        // Notification Permission Modal
        enableNotifications: "Enable Notifications",
        enableNotificationsDesc: "Get notified when someone sends you a whispa or starts following you.",
        enableInSettings: "Enable in Settings",
        notNow: "Not now",

        language: "Language",

        contactUs: "Contact Us",
        contactDesc: "Have feedback or a question? Send us a message.",
        contactPlaceholder: "Write your message...",
        messageSent: "Message sent!",
        tapToClose: "Tap anywhere to close",
        remove: "Remove",
    },

    az: {
        // App
        appName: "WhispaMe",
        appTagline: "anonim rəy, dürüstcə.",
        appAnonymousBadge: "100% anonim mesajlar",
        appVersion: "WhispaMe v",

        // Auth - Sign In
        signIn: "Daxil ol",
        signInWelcome: "Xoş gəldiniz.",
        signInVerifyIdentity: "kimliyinizi təsdiqləyin",
        email: "E-poçt",
        emailPlaceholder: "siz@misal.com",
        password: "Şifrə",
        passwordPlaceholder: "Şifrə daxil edin",
        continue: "Davam et",
        signingIn: "Daxil olunur...",
        noAccount: "Hesabınız yoxdur?",
        signUp: "Qeydiyyat",
        invalidEmailOrPassword: "E-poçt və ya şifrə yanlışdır",

        // Auth - Sign Up
        createAccount: "Hesab Yarat",
        username: "İstifadəçi adı",
        usernamePlaceholder: "İstifadəçi adı yaradın",
        creatingAccount: "Hesab yaradılır...",
        alreadyHaveAccount: "Artıq hesabınız var?",
        passwordInvalidChars: "Şifrə yalnız standart ingilis hərfləri, rəqəmlər və simvollar ola bilər",
        somethingWentWrong: "Bir şey səhv getdi",

        // Auth - Verify
        checkYourCode: "Kodunuzu Yoxlayın",
        code: "Kod",
        codePlaceholder: "Doğrulama kodunu daxil edin",
        verifyCodePlaceholder: "Kodu daxil edin",
        verify: "Təsdiqlə",
        verifying: "Təsdiqlənir...",
        resendCode: "Kodu yenidən göndər",
        startOver: "Yenidən başla",
        invalidCode: "Yanlış kod",

        // Tabs
        home: "Ana Səhifə",
        search: "Axtarış",
        profile: "Profil",

        // Home Screen
        liked: "❤️ Bəyənilənlər",
        allCaughtUp: "Hamısına baxdınız",
        noMoreWhispas: "Baxılacaq Whispa qalmadı",

        // Liked Overlay
        likedWhispas: "Bəyənilən Whispalar",
        close: "Bağla",
        noLikedWhispas: "Bəyənilən whispa yoxdur",
        likeWhispasToSee: "Burada görmək üçün whispaları bəyənin",

        // Search Screen
        searchPlaceholder: "İstifadəçi axtar...",
        findPeople: "İnsanları tap",
        searchByUsername: "Whispa göndərmək üçün istifadəçi adı ilə axtarın",
        noUsersFound: "İstifadəçi tapılmadı",
        tryDifferentUsername: "Fərqli istifadəçi adı sınayın",

        // Profile Screen
        followers: "İzləyicilər",
        following: "İzlənilənlər",
        editProfile: "Profili Düzənlə",
        acceptingWhispas: "Whispa Qəbul Edilir",
        whispasOff: "Whispalar söndürülüb",
        onlyFollowersCanWhispa: "Yalnız izləyicilər sizə Whispa göndərə bilər",
        everyoneCanWhispa: "Hər kəs sizə Whispa göndərə bilər",
        failedToLoadProfile: "Profil yüklənmədi",

        // User Profile Screen
        back: "← Geri",
        follow: "İzlə",
        unfollow: "İzləməyi dayandır",
        sendAnonymousWhispa: "Anonim Whispa Göndər",
        userNotFound: "İstifadəçi tapılmadı",
        userDoesntFollowBack: "🔒 İstifadəçi sizi izlənilənlərə əlavə etməyib",
        inboxClosed: "İstifadəçi Whispa qəbul etmir",

        // Send Whispa Modal
        sendWhispa: "Whispa Göndər",
        cancel: "Ləğv et",
        whispaAnonymous: "Whispanız tamamilə anonimdir",
        writeWhispaPlaceholder: "Whispanızı yazın...",
        send: "Göndər",
        whispaSent: "Whispa göndərildi!",
        whispaTooShort: "Whispa ən azı 2 simvol olmalıdır",

        // Settings Screen
        settings: "Parametrlər",
        editUsername: "İstifadəçi Adını Düzənlə",
        editBio: "Bio-nu Düzənlə",
        acceptWhispas: "Whispaları Qəbul Et",
        followersOnly: "Yalnız İzləyicilər",
        followersOnlyDesc: "Yalnız izləyicilər sizə Whispa göndərə bilər",
        showFollowers: "İzləyiciləri Göstər",
        showFollowing: "İzlənilənləri Göstər",
        signOut: "Çıxış",

        // Edit Username Screen
        editUsernameTitle: "İstifadəçi Adını Düzənlə",
        newUsernamePlaceholder: "Yeni istifadəçi adı",
        usernameCannotBeEmpty: "İstifadəçi adı boş ola bilməz",
        failedToUpdateUsername: "İstifadəçi adı yenilənmədi",
        save: "Saxla",

        // Edit Bio Screen
        editBioTitle: "Bio-nu Düzənlə",
        bioPlaceholder: "Özünüz haqqında nəsə yazın...",
        bioTooLong: "Bio 160 simvoldan çox ola bilməz",
        failedToUpdateBio: "Bio yenilənmədi",

        // Follow Modal
        noFollowersYet: "Hələ izləyici yoxdur",
        notFollowingAnyone: "Heç kəsi izləmirsiniz",
        shareProfileForFollowers: "İzləyici qazanmaq üçün profilinizi paylaşın",
        searchForPeopleToFollow: "İzləmək üçün insanları axtarın",

        // FeedbackCard
        anonymous: "anonim",

        // Permission
        galleryPermissionRequired: "Qalereya icazəsi tələb olunur",

        // Notification Permission Modal
        enableNotifications: "Bildirişləri Aktiv Et",
        enableNotificationsDesc: "Kimsə sizə whispa göndərəndə və ya sizi izləməyə başlayanda xəbər alın.",
        enableInSettings: "Parametrlərdə Aktiv Et",
        notNow: "İndi yox",

        language: "Dil",

        contactUs: "Bizimlə Əlaqə",
        contactDesc: "Rəyiniz və ya sualınız var? Bizə mesaj göndərin.",
        contactPlaceholder: "Mesajınızı yazın...",
        messageSent: "Mesaj göndərildi!",

        tapToClose: "Bağlamaq üçün istənilən yerə toxunun",
        remove: "Sil",


    },
});

i18n.locale = "en";
i18n.enableFallback = true;

export default i18n;