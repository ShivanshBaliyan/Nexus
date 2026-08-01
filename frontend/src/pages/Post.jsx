import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";

import {
    getPost,
    getComments,
    createComment,
} from "../api/posts";

import CommentCard from "../components/CommentCard";

export default function Post() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        async function loadData() {
            try {
                const [postData, commentsData] = await Promise.all([
                    getPost(id),
                    getComments(id),
                ]);

                setPost(postData);
                setComments(commentsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            const newComment = await createComment(id, content);

            setComments((current) => [...current, newComment]);

            setContent("");
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!post) {
        return <h1>Post not found.</h1>;
    }

    return (
        <div>
            <h1>{post.title}</h1>

            <p>{post.content}</p>

            <p>
                By <strong>{post.author.username}</strong>
            </p>

            <div>
                <button onClick={upvote}>
                    ▲
                </button>

                <strong> {post.score} </strong>

                <button onClick={downvote}>
                    ▼
                </button>
            </div>

            <hr />

            <h2>Comments</h2>

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((comment) => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                    />
                ))
            )}

            <hr />

            <h2>Add Comment</h2>

            <form onSubmit={handleSubmit}>
                <textarea
                    rows={4}
                    cols={60}
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                />

                <br />
                <br />

                <button type="submit">
                    Submit Comment
                </button>
            </form>
        </div>
    );
}