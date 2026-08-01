import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getUserProfile } from "../api/users";
import PostCard from "../components/PostCard";
import client from "../api/client";

export default function Profile() {
    const { username } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function handleVote(postId, value) {
        try {
            await client.post(`/posts/${postId}/vote`, {
                value,
            });

            setUser((currentUser) => ({
                ...currentUser,
                posts: currentUser.posts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              score: post.score + value,
                          }
                        : post
                ),
            }));
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
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <h1>User not found.</h1>;
    }

    return (
        <div>
            <h1>{user.username}</h1>

            <p>
                <strong>Display Name:</strong>{" "}
                {user.display_name || "Not set"}
            </p>

            <p>
                <strong>Bio:</strong>{" "}
                {user.bio || "No bio yet."}
            </p>

            <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.created_at).toLocaleDateString()}
            </p>

            <hr />

            <h2>Communities</h2>

            {user.communities.length === 0 ? (
                <p>Not a member of any communities.</p>
            ) : (
                <ul>
                    {user.communities.map((community) => (
                        <li key={community.id}>
                            {community.name}
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Posts</h2>

            {user.posts.length === 0 ? (
                <p>No posts yet.</p>
            ) : (
                user.posts.map((post) => (
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