import client from "./client";

export async function getCommunities() {
    const response = await client.get("/communities");
    return response.data;
}

export async function createCommunity(community) {
    const response = await client.post("/communities", community);
    return response.data;
}