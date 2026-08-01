import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

import {
    getFeed,
    votePost,
} from "../api/posts";

export default function Home() {
    const { isAuthenticated } = useAuth();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    async function handleVote(postId, value) {
        try {
            await votePost(postId, value);

            const updatedPosts = await getFeed();
            setPosts(updatedPosts);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadFeed() {
            try {
                const data = await getFeed();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadFeed();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-xl font-semibold">
                    Loading your feed...
                </h2>

                <p className="mt-2 text-gray-500">
                    Fetching the latest posts.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Home Feed
                    </h1>

                    <p className="mt-2 text-gray-500">
                        See the latest posts from your communities.
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

            {posts.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center shadow">
                    <h2 className="text-2xl font-semibold">
                        No posts yet
                    </h2>

                    <p className="mt-3 text-gray-500">
                        Join a community or create the first post to
                        get the conversation started.
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