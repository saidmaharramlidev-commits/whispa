import { useAuth } from "@clerk/expo";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const useApi = () => {
    const { getToken } = useAuth();

    const request = async (endpoint: string, options: RequestInit = {}) => {
        const token = await getToken();

        if (!token) {
            console.log("No token available for:", endpoint)
            throw new Error("Not authenticated");
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
            console.log("API Error:", response.status, endpoint, JSON.stringify(data))
            throw new Error(data.message || "Something went wrong");
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
    const removeFollower = (username: string) =>
        request(`/users/${username}/remove-follower`, {
            method: "DELETE",
        });

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
        removeFollower
    };
};