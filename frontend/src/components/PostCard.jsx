import client from "../api/client";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {

    async function upvote() {
        try {
            await client.post(`/posts/${post.id}/vote`, {
                value: 1,
            });

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
        // await onVote(post.id, 1);
    }

    async function downvote() {
        try {
            await client.post(`/posts/${post.id}/vote`, {
                value: -1,
            });

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
        // await onVote(post.id, -1);
    }

    return (
        <div
            style={{
                border: "1px solid gray",
                padding: "1rem",
                marginBottom: "1rem",
            }}
        >
            <h2>
                <Link to={`/posts/${post.id}`}>
                    {post.title}
                </Link>
            </h2>

            <p>{post.content}</p>

            <p>
                <strong>Community:</strong>{" "}
                <Link to={`/communities/${post.community.name}`}>
                    {post.community.name}
                </Link>
            </p>

            <p>
                <strong>Author:</strong>{" "}
                {post.author.username}
            </p>

            <div>
                <button onClick={upvote}>
                    ▲
                </button>

                <strong>{post.score}</strong>

                <button onClick={downvote}>
                    ▼
                </button>
            </div>
        </div>
    );
}