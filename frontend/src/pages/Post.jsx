import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    getPost,
    getComments,
    createComment,
    votePost,
} from "../api/posts";

import CommentCard from "../components/CommentCard";

export default function Post() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    async function handleVote(value) {
        try {
            await votePost(post.id, value);

            const updatedPost = await getPost(id);
            setPost(updatedPost);
        } catch (error) {
            console.error(error);
        }
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
        return (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-xl font-semibold">
                    Loading post...
                </h2>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="rounded-xl bg-white p-8 text-center shadow">
                <h2 className="text-2xl font-bold">
                    Post not found
                </h2>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">
            {/* Post */}

            <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
                <Link
                    to={`/communities/${post.community.name}`}
                    className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
                >
                    r/{post.community.name}
                </Link>

                <h1 className="mt-4 text-4xl font-bold">
                    {post.title}
                </h1>

                <p className="mt-5 whitespace-pre-wrap text-lg text-gray-700">
                    {post.content}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between border-t pt-4">
                    <div className="text-sm text-gray-500">
                        Posted by{" "}
                        <Link
                            to={`/users/${post.author.username}`}
                            className="font-semibold text-gray-700 hover:text-blue-600"
                        >
                            @{post.author.username}
                        </Link>
                        {" • "}
                        {new Date(post.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleVote(1)}
                            className="rounded-lg border px-3 py-2 hover:bg-green-100"
                        >
                            ▲
                        </button>

                        <span className="min-w-8 text-center font-bold">
                            {post.score}
                        </span>

                        <button
                            onClick={() => handleVote(-1)}
                            className="rounded-lg border px-3 py-2 hover:bg-red-100"
                        >
                            ▼
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments */}

            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-6 text-2xl font-bold">
                    Comments ({comments.length})
                </h2>

                {comments.length === 0 ? (
                    <p className="text-gray-500">
                        No comments yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Add Comment */}

            <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-6 text-2xl font-bold">
                    Add Comment
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <textarea
                        rows={5}
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="Write your comment..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Submit Comment
                    </button>
                </form>
            </div>
        </div>
    );
}