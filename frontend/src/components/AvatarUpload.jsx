import { useState } from "react";
import toast from "react-hot-toast";

import {
    getAvatarUploadUrl,
    uploadFile,
} from "../api/storage";

import { updateProfile } from "../api/users";

const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

export default function AvatarUpload({
    user,
    editable,
    onUploaded,
}) {
    const [uploading, setUploading] =
        useState(false);

    async function handleChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error(
                "Please choose a PNG, JPG or WEBP image."
            );
            return;
        }

        try {
            setUploading(true);

            const extension =
                file.name.split(".").pop().toLowerCase();

            const {
                upload_url,
                public_url,
            } =
                await getAvatarUploadUrl(extension);

            await uploadFile(upload_url, file);

            const updatedUser =
                await updateProfile({
                    display_name:
                        user.display_name,
                    bio: user.bio,
                    avatar_url: public_url,
                });

            toast.success(
                "Avatar updated successfully!"
            );

            onUploaded(updatedUser);
        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to upload avatar."
            );
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="relative">
            {user.avatar_url ? (
                <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="h-24 w-24 rounded-full object-cover border"
                />
            ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
                    {user.username
                        .charAt(0)
                        .toUpperCase()}
                </div>
            )}

            {editable && (
                <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow hover:bg-blue-700">
                    {uploading ? "..." : "📷"}

                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        disabled={uploading}
                        onChange={handleChange}
                    />
                </label>
            )}
        </div>
    );
}