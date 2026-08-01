import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCommunities } from "../api/communities";
import { createPost } from "../api/posts";

export default function CreatePost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [communityId, setCommunityId] = useState("");

    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCommunities() {
            try {
                const data = await getCommunities();
                setCommunities(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadCommunities();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await createPost({
                title,
                content,
                community_id: Number(communityId),
            });

            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Failed to create post.");
        }
    }

    if (loading) {
        return <h2>Loading communities...</h2>;
    }

    return (
        <div>
            <h1>Create Post</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>

                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Content</label>

                    <textarea
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Community</label>

                    <select
                        value={communityId}
                        onChange={(e) =>
                            setCommunityId(e.target.value)
                        }
                    >
                        <option value="">
                            Select Community
                        </option>

                        {communities.map((community) => (
                            <option
                                key={community.id}
                                value={community.id}
                            >
                                {community.name}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <button type="submit">
                    Create Post
                </button>
            </form>
        </div>
    );
}