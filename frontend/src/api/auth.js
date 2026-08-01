import client from "./client";

export async function loginUser(username, password) {
    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const response = await client.post(
        "/auth/login",
        formData
    );

    return response.data;
}

export async function registerUser(user) {
    const response = await client.post(
        "/auth/register",
        user
    );

    return response.data;
}