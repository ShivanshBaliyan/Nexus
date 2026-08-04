import client from "./client";

export async function getAvatarUploadUrl(extension) {
    const response = await client.post(
        "/users/me/avatar/upload-url",
        null,
        {
            params: {
                extension,
            },
        }
    );

    return response.data;
}

export async function uploadFile(uploadUrl, file) {
    await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });
}

export async function getPostUploadUrl(extension) {
    const response = await client.post(
        "/posts/upload-url",
        null,
        {
            params: {
                extension,
            },
        }
    );

    return response.data;
}