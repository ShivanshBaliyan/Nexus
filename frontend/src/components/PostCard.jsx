import { Link } from "react-router-dom";

export default function PostCard({ post, onVote }) {
    function upvote() {
        onVote?.(post.id, 1);
    }

    function downvote() {
        onVote?.(post.id, -1);
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            {/* Community */}

            <Link
                to={`/communities/${post.community.name}`}
                className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
            >
                r/{post.community.name}
            </Link>

            {/* Title */}

            <Link to={`/posts/${post.id}`}>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 transition hover:text-blue-600">
                    {post.title}
                </h2>
            </Link>

            {/* Image */}

            {post.image_url && (
                <img
                    src={post.image_url}
                    alt={post.title}
                    className="mb-4 max-h-125 w-full rounded-xl border object-cover"
                />
            )}

            {/* Content */}

            <p className="mb-4 whitespace-pre-wrap text-gray-700">
                {post.content}
            </p>

            {/* Footer */}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
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
                        onClick={upvote}
                        className="rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-green-100"
                    >
                        ▲
                    </button>

                    <span className="min-w-8 text-center font-bold">
                        {post.score}
                    </span>

                    <button
                        onClick={downvote}
                        className="rounded-lg border border-gray-200 px-3 py-2 transition hover:bg-red-100"
                    >
                        ▼
                    </button>
                </div>
            </div>
        </div>
    );
}