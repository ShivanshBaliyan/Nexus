import { useState } from "react";
import toast from "react-hot-toast";

import {
    createComment,
    updateComment,
    deleteComment,
} from "../api/posts";

export default function CommentCard({
    comment,
    currentUser,
    onRefresh,
}) {
    const [editing, setEditing] = useState(false);
    const [content, setContent] = useState(comment.content);

    const [replying, setReplying] = useState(false);
    const [reply, setReply] = useState("");

    const [collapsed, setCollapsed] = useState(false);

    async function handleSave() {
        try {
            await updateComment(comment.id, content);

            setEditing(false);
            onRefresh();

            toast.success("Comment updated.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update comment.");
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            "Delete this comment?"
        );

        if (!confirmed) return;

        try {
            await deleteComment(comment.id);

            onRefresh();

            toast.success("Comment deleted.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete comment.");
        }
    }

    async function handleReply() {
        if (!reply.trim()) return;

        try {
            await createComment(
                comment.post_id,
                reply,
                comment.id
            );

            setReply("");
            setReplying(false);

            onRefresh();

            toast.success("Reply added.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reply.");
        }
    }

    return (
        <div className="mt-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                {/* Header */}

                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-800">
                            {comment.author.username}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {new Date(
                                comment.created_at
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    {currentUser?.username ===
                        comment.author.username && (
                        <div className="flex gap-2">
                            {!editing && (
                                <>
                                    <button
                                        onClick={() =>
                                            setEditing(true)
                                        }
                                        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={handleDelete}
                                        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Edit */}

                {editing ? (
                    <>
                        <textarea
                            rows={4}
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 p-3"
                        />

                        <div className="mt-3 flex gap-3">
                            <button
                                onClick={handleSave}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setContent(
                                        comment.content
                                    );
                                }}
                                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Comment */}

                        <p className="whitespace-pre-wrap text-gray-700">
                            {comment.content}
                        </p>

                        {/* Actions */}

                        <div className="mt-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setReplying(
                                        !replying
                                    )
                                }
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Reply

                                {comment.replies
                                    ?.length > 0 && (
                                    <span className="ml-2 text-gray-500">
                                        •{" "}
                                        {
                                            comment
                                                .replies
                                                .length
                                        }{" "}
                                        {comment
                                            .replies
                                            .length ===
                                        1
                                            ? "reply"
                                            : "replies"}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Reply Form */}

                        {replying && (
                            <div className="mt-4">
                                <textarea
                                    rows={3}
                                    value={reply}
                                    onChange={(e) =>
                                        setReply(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Write a reply..."
                                    className="w-full rounded-lg border border-gray-300 p-3"
                                />

                                <div className="mt-3 flex gap-3">
                                    <button
                                        onClick={
                                            handleReply
                                        }
                                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    >
                                        Reply
                                    </button>

                                    <button
                                        onClick={() => {
                                            setReplying(
                                                false
                                            );
                                            setReply(
                                                ""
                                            );
                                        }}
                                        className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Replies */}

            {comment.replies?.length > 0 && (
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() =>
                            setCollapsed(
                                !collapsed
                            )
                        }
                        className="mb-3 text-sm font-medium text-blue-600 hover:underline"
                    >
                        {collapsed
                            ? `▶ Show ${
                                  comment
                                      .replies
                                      .length
                              } ${
                                  comment
                                      .replies
                                      .length ===
                                  1
                                      ? "reply"
                                      : "replies"
                              }`
                            : `▼ Hide ${
                                  comment
                                      .replies
                                      .length
                              } ${
                                  comment
                                      .replies
                                      .length ===
                                  1
                                      ? "reply"
                                      : "replies"
                              }`}
                    </button>

                    {!collapsed && (
                        <div className="relative ml-5 space-y-3 pl-5">
                            <div className="absolute bottom-0 left-0 top-0 w-px bg-gray-300"></div>

                            {comment.replies.map(
                                (reply) => (
                                    <CommentCard
                                        key={
                                            reply.id
                                        }
                                        comment={
                                            reply
                                        }
                                        currentUser={
                                            currentUser
                                        }
                                        onRefresh={
                                            onRefresh
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}