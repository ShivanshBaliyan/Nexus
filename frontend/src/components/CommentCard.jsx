export default function CommentCard({ comment }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginTop: "1rem",
            }}
        >
            <p>{comment.content}</p>

            <small>
                By {comment.author.username}
            </small>
        </div>
    );
}