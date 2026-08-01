import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import client from "../api/client";
import PostCard from "../components/PostCard";

export default function Community() {
    const { name } = useParams();

    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCommunity() {
            try {
                const [communityResponse, postsResponse] = await Promise.all([
                    client.get(`/communities/${name}`),
                    client.get(`/communities/${name}/posts`),
                ]);

                setCommunity(communityResponse.data);
                setPosts(postsResponse.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadCommunity();
    }, [name]);

    if (loading) return <h1>Loading...</h1>;

    if (!community) return <h1>Community not found</h1>;

    return (
        <div>
            <h1>r/{community.name}</h1>

            <p>{community.description}</p>

            <p>Members: {community.member_count}</p>

            <hr />

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