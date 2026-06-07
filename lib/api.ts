import { useAuth } from "@clerk/expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const useApi = () => {
    const { getToken } = useAuth();

    const request = async (endpoint: string, options: RequestInit = {}) => {
        const token = await getToken();


        if (!token) {
            throw new Error("No Clerk token found");
        }


        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || "Something went wrong");
        }

        return data;
    };

    // ── User ──────────────────────────────────────
    const getMe = () => request("/users/me");
    const updateMe = (body: object) => request("/users/me", {
        method: "PATCH",
        body: JSON.stringify(body),
    });
    const getUserByUsername = (username: string) =>
        request(`/users/${username}`);
    const searchUsers = (q: string) => request(`/users/search?q=${q}`);

    // ── Follow ────────────────────────────────────
    const toggleFollow = (username: string) =>
        request(`/users/${username}/toggle`, {
            method: "POST",
        });
    const getFollowers = (username: string) =>
        request(`/users/${username}/followers`);
    const getFollowing = (username: string) =>
        request(`/users/${username}/following`);

    // ── Feedback ──────────────────────────────────
    const getMyFeedbacks = () => request("/feedbacks/me");
    const getLikedFeedbacks = () => request("/feedbacks/liked");
    const sendFeedback = (username: string, text: string) =>
        request(`/feedbacks/${username}`, {
            method: "POST",
            body: JSON.stringify({ text }),
        });
    const deleteFeedback = (id: string) =>
        request(`/feedbacks/${id}`, { method: "DELETE" });


    const toggleLikeFeedback = (id: string) =>
        request(`/feedbacks/${id}/like`, {
            method: "PATCH",
        });

    return {
        getMe,
        updateMe,
        getUserByUsername,
        searchUsers,
        toggleFollow,
        getFollowers,
        getFollowing,
        getMyFeedbacks,
        getLikedFeedbacks,
        sendFeedback,
        deleteFeedback,
        toggleLikeFeedback,
    };
};