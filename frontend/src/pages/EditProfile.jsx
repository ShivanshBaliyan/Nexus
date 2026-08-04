import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getCurrentUser,
    updateProfile,
} from "../api/users";

export default function EditProfile() {
    const navigate = useNavigate();

    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUser();

                setDisplayName(user.display_name || "");
                setBio(user.bio || "");
                setAvatarUrl(user.avatar_url || "");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await updateProfile({
                display_name: displayName,
                bio,
                avatar_url: avatarUrl,
            });

            navigate(`/users/${(await getCurrentUser()).username}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.");
        }
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-3xl font-bold">
                Edit Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div>
                    <label className="mb-2 block font-medium">
                        Display Name
                    </label>

                    <input
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        value={displayName}
                        onChange={(e) =>
                            setDisplayName(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Bio
                    </label>

                    <textarea
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        value={bio}
                        onChange={(e) =>
                            setBio(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Avatar URL
                    </label>

                    <input
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        value={avatarUrl}
                        onChange={(e) =>
                            setAvatarUrl(e.target.value)
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}