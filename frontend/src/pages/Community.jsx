import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    getCommunity,
    getCommunityPosts,
} from "../api/communities";

import { votePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";

import PostCard from "../components/PostCard";

export default function Community() {
    const { name } = useParams();
    const { isAuthenticated } = useAuth();

    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    async function handleVote(postId, value) {
        try {
            await votePost(postId, value);

            const updatedPosts = await getCommunityPosts(name);
            setPosts(updatedPosts);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadCommunity() {
            try {
                const [communityData, postsData] = await Promise.all([
                    getCommunity(name),
                    getCommunityPosts(name),
                ]);

                setCommunity(communityData);
                setPosts(postsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadCommunity();
    }, [name]);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-xl font-semibold">
                    Loading community...
                </h2>

                <p className="mt-2 text-gray-500">
                    Please wait while we fetch the latest posts.
                </p>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-2xl font-bold">
                    Community not found
                </h2>

                <p className="mt-2 text-gray-500">
                    The community you're looking for doesn't exist.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">
            {/* Community Header */}

            <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            r/{community.name}
                        </h1>

                        <p className="mt-3 text-gray-600">
                            {community.description ||
                                "No description provided."}
                        </p>

                        <p className="mt-4 text-sm font-medium text-gray-500">
                            {community.member_count} members
                        </p>
                    </div>

                    {isAuthenticated && (
                        <Link
                            to="/create-post"
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Create Post
                        </Link>
                    )}
                </div>
            </div>

            {/* Posts */}

            {posts.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center shadow">
                    <h2 className="text-2xl font-semibold">
                        No posts yet
                    </h2>

                    <p className="mt-3 text-gray-500">
                        Be the first person to post in this community.
                    </p>

                    {isAuthenticated && (
                        <Link
                            to="/create-post"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Create the First Post
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onVote={handleVote}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}