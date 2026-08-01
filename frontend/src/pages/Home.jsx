import { useEffect, useState } from "react";

import client from "../api/client";
import PostCard from "../components/PostCard";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    async function handleVote(postId, value) {
        try {
            await client.post(`/posts/${postId}/vote`, {
                value,
            });

            setPosts((currentPosts) =>
                currentPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            score: post.score + value,
                        }
                        : post
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadFeed() {
            try {
                const response = await client.get("/feed");

                setPosts(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadFeed();
    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <h1>Home Feed</h1>

            {posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onVote={handleVote}
                    />
                ))
            )}
        </div>
    );
}