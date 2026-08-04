import { useState } from "react";
import toast from "react-hot-toast";

import {
    getPostUploadUrl,
    uploadFile,
} from "../api/storage";

const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

export default function PostImageUpload({
    imageUrl,
    onUploaded,
}) {
    const [uploading, setUploading] = useState(false);

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

            const extension = file.name
                .split(".")
                .pop()
                .toLowerCase();

            const {
                upload_url,
                public_url,
            } = await getPostUploadUrl(extension);

            await uploadFile(upload_url, file);

            toast.success("Image uploaded!");

            onUploaded(public_url);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            <label className="mb-2 block text-sm font-medium">
                Image
            </label>

            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Preview"
                    className="mb-4 max-h-96 w-full rounded-xl border object-cover"
                />
            )}

            <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 transition hover:border-blue-500 hover:bg-blue-50">
                <div className="text-center">
                    <div className="text-4xl">📷</div>

                    <p className="mt-3 font-medium">
                        {uploading
                            ? "Uploading..."
                            : imageUrl
                            ? "Change Image"
                            : "Choose Image"}
                    </p>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
}