import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getPost,
    getComments,
    createComment,
    votePost,
    deletePost,
} from "../api/posts";

import { getCurrentUser } from "../api/users";
import CommentCard from "../components/CommentCard";

export default function Post() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
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

    async function loadComments() {
        try {
            const data = await getComments(id);
            setComments(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadData() {
            try {
                const [postData, commentsData, me] =
                    await Promise.all([
                        getPost(id),
                        getComments(id),
                        getCurrentUser().catch(() => null),
                    ]);

                setPost(postData);
                setComments(commentsData);
                setCurrentUser(me);
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

        if (!content.trim()) {
            return;
        }

        try {
            await createComment(id, content);

            setContent("");

            await loadComments();

            toast.success("Comment added.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add comment.");
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePost(post.id);

            navigate("/");
        } catch (error) {
            console.error(error);

            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error("Failed to delete post.");
            }
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

                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="mt-6 mb-6 max-h-175 w-full rounded-2xl border object-cover shadow"
                    />
                )}

                <p className="mt-5 whitespace-pre-wrap text-lg text-gray-700">
                    {post.content}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                    <div className="text-sm text-gray-500">
                        Posted by{" "}
                        <Link
                            to={`/users/${post.author.username}`}
                            className="font-semibold text-gray-700 hover:text-blue-600"
                        >
                            @{post.author.username}
                        </Link>
                        {" • "}
                        {new Date(
                            post.created_at
                        ).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                handleVote(1)
                            }
                            className="rounded-lg border px-3 py-2 hover:bg-green-100"
                        >
                            ▲
                        </button>

                        <span className="min-w-8 text-center font-bold">
                            {post.score}
                        </span>

                        <button
                            onClick={() =>
                                handleVote(-1)
                            }
                            className="rounded-lg border px-3 py-2 hover:bg-red-100"
                        >
                            ▼
                        </button>

                        {currentUser?.username ===
                            post.author.username && (
                            <>
                                <Link
                                    to={`/posts/${post.id}/edit`}
                                    className="ml-3 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={
                                        handleDelete
                                    }
                                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </>
                        )}
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
                                currentUser={currentUser}
                                onRefresh={loadComments}
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
                            setContent(
                                e.target.value
                            )
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