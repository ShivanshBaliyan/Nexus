import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getUserProfile } from "../api/users";
import { votePost } from "../api/posts";

import PostCard from "../components/PostCard";

export default function Profile() {
    const { username } = useParams();

    const [user, setUser] = useState(null);
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
                const data = await getUserProfile(username);
                setUser(data);
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
                <div className="flex items-start gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">
                            {user.display_name || user.username}
                        </h1>

                        <p className="mt-1 text-gray-500">
                            @{user.username}
                        </p>

                        <p className="mt-4 text-gray-700">
                            {user.bio || "This user hasn't written a bio yet."}
                        </p>

                        <p className="mt-4 text-sm text-gray-500">
                            Joined{" "}
                            {new Date(
                                user.created_at
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Communities */}

            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">
                    Communities
                </h2>

                {user.communities.length === 0 ? (
                    <p className="text-gray-500">
                        Not a member of any communities.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {user.communities.map((community) => (
                            <Link
                                key={community.id}
                                to={`/communities/${community.name}`}
                                className="rounded-full bg-blue-100 px-4 py-2 text-blue-700 transition hover:bg-blue-200"
                            >
                                r/{community.name}
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