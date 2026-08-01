import client from "./client";

export async function search(query) {
    const response = await client.get("/search", {
        params: {
            q: query,
        },
    });

    return response.data;
}