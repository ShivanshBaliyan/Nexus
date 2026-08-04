import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    getAvatarUploadUrl,
    uploadFile,
} from "../api/storage";

import {
    getCurrentUser,
    getUserProfile,
    updateProfile,
} from "../api/users";

import { votePost } from "../api/posts";
import PostCard from "../components/PostCard";
import AvatarUpload from "../components/AvatarUpload";

export default function Profile() {
    const { username } = useParams();
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function handleVote(postId, value) {
        try {
            await votePost(postId, value);

            const updatedUser = await getUserProfile(username);
            setUser(updatedUser);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadProfile() {
            try {
                const [profile, me] = await Promise.all([
                    getUserProfile(username),
                    getCurrentUser().catch(() => null),
                ]);

                setUser(profile);
                setCurrentUser(me);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-xl font-semibold">
                    Loading profile...
                </h2>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-2xl font-bold">
                    User not found
                </h2>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">
            {/* Profile Header */}

            <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
                <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-6">
                        <AvatarUpload
                            user={user}
                            editable={currentUser?.username === user.username}
                            onUploaded={async () => {
                                const profile = await getUserProfile(username);
                                setUser(profile);
                            }}
                        />

                        <div>
                            <h1 className="text-3xl font-bold">
                                {user.display_name || user.username}
                            </h1>

                            <p className="mt-1 text-gray-500">
                                @{user.username}
                            </p>

                            <p className="mt-4 text-gray-700">
                                {user.bio ||
                                    "This user hasn't written a bio yet."}
                            </p>

                            <p className="mt-4 text-sm text-gray-500">
                                Joined{" "}
                                {new Date(
                                    user.created_at
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {currentUser?.username === user.username && (
                        <Link
                            to="/profile/edit"
                            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Edit Profile
                        </Link>
                    )}
                </div>
            </div>

            {/* Created Communities */}

            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-5 text-2xl font-bold">
                    Communities Created
                </h2>

                {user.created_communities.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                        <p className="text-gray-500">
                            No communities created yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {user.created_communities.map((community) => (
                            <Link
                                key={community.id}
                                to={`/communities/${community.name}`}
                                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-blue-500 hover:shadow-md"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        r/{community.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {community.title}
                                    </p>
                                </div>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                    View →
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Joined Communities */}

            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-5 text-2xl font-bold">
                    Communities Joined
                </h2>

                {user.joined_communities.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                        <p className="text-gray-500">
                            Not a member of any communities yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {user.joined_communities.map((community) => (
                            <Link
                                key={community.id}
                                to={`/communities/${community.name}`}
                                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-blue-500 hover:shadow-md"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        r/{community.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {community.title}
                                    </p>
                                </div>

                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                    Joined ✓
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Posts */}

            <div>
                <h2 className="mb-6 text-2xl font-bold">
                    Posts
                </h2>

                {user.posts.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow">
                        <p className="text-gray-500">
                            This user hasn't created any posts yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {user.posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onVote={handleVote}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}