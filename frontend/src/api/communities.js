import client from "./client";

export async function getCommunities() {
    const response = await client.get("/communities");
    return response.data;
}

export async function getCommunity(name) {
    const response = await client.get(`/communities/${name}`);
    return response.data;
}

export async function getCommunityPosts(name) {
    const response = await client.get(
        `/communities/${name}/posts`
    );

    return response.data;
}

export async function createCommunity(community) {
    const response = await client.post(
        "/communities",
        community
    );

    return response.data;
}

export async function joinCommunity(name) {
    const response = await client.post(
        `/communities/${name}/join`
    );

    return response.data;
}

export async function leaveCommunity(name) {
    const response = await client.delete(
        `/communities/${name}/join`
    );

    return response.data;
}