import client from "./client";

export async function getFeed(page = 1, limit = 10) {
    const response = await client.get("/feed", {
        params: {
            page,
            limit,
        },
    });

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

export async function updatePost(postId, post) {
    const response = await client.put(
        `/posts/${postId}`,
        post
    );

    return response.data;
}

export async function deletePost(postId) {
    await client.delete(`/posts/${postId}`);
}

export async function votePost(postId, value) {
    const response = await client.post(
        `/posts/${postId}/vote`,
        {
            value,
        }
    );

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

export async function createComment(
    postId,
    content,
    parentId = null
) {
    const response = await client.post(
        `/posts/${postId}/comments`,
        {
            content,
            parent_id: parentId,
        }
    );

    return response.data;
}

export async function updateComment(commentId, content) {
    const response = await client.put(
        `/comments/${commentId}`,
        {
            content,
        }
    );

    return response.data;
}

export async function deleteComment(commentId) {
    await client.delete(`/comments/${commentId}`);
}