import client from "./client";

export async function loginUser(formData) {
    const response = await client.post("/auth/login", formData);
    return response.data;
}

export async function registerUser(user) {
    const response = await client.post("/auth/register", user);
    return response.data;
}