// import client from "./client";

// export async function getFeed() {
//     const response = await client.get("/feed");
//     return response.data;
// }

// export async function votePost(postId, value) {
//     await client.post(`/posts/${postId}/vote`, {
//         value,
//     });
// }

// export async function getPost(postId) {
//     const response = await client.get(`/posts/${postId}`);
//     return response.data;
// }

// export async function getComments(postId) {
//     const response = await client.get(`/posts/${postId}/comments`);
//     return response.data;
// }

// export async function createComment(postId, content) {
//     const response = await client.post(`/posts/${postId}/comments`, {
//         content,
//     });

//     return response.data;
// }

// export async function createPost(post) {
//     const response = await client.post("/posts", post);
//     return response.data;
// }


import client from "./client";

export async function getFeed() {
    const response = await client.get("/feed");
    return response.data;
}

export async function getPost(id) {
    const response = await client.get(`/posts/${id}`);
    return response.data;
}

export async function createPost(post) {
    const response = await client.post("/posts", post);
    return response.data;
}

export async function votePost(postId, value) {
    const response = await client.post(`/posts/${postId}/vote`, {
        value,
    });

    return response.data;
}

export async function removeVote(postId) {
    await client.delete(`/posts/${postId}/vote`);
}

export async function getComments(postId) {
    const response = await client.get(
        `/posts/${postId}/comments`
    );

    return response.data;
}

export async function createComment(postId, content) {
    const response = await client.post(
        `/posts/${postId}/comments`,
        {
            content,
        }
    );

    return response.data;
}