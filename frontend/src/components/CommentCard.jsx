export default function CommentCard({ comment }) {
    return (
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                    {comment.author.username}
                </h3>

                <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                </span>
            </div>

            <p className="whitespace-pre-wrap text-gray-700">
                {comment.content}
            </p>
        </div>
    );
}