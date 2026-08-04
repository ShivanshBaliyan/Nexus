import client from "./client";

export async function getCurrentUser() {
    const response = await client.get("/users/me");
    return response.data;
}

export async function getUserProfile(username) {
    const response = await client.get(
        `/users/${username}`
    );

    return response.data;
}

export async function updateProfile(profile) {
    const response = await client.put(
        "/users/me",
        profile
    );

    return response.data;
}


