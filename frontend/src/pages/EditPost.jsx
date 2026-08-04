import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getPost,
    updatePost,
} from "../api/posts";

import { getCommunities } from "../api/communities";
import PostImageUpload from "../components/PostImageUpload";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [communityId, setCommunityId] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [post, communities] = await Promise.all([
                    getPost(id),
                    getCommunities(),
                ]);

                setTitle(post.title);
                setContent(post.content);
                setCommunityId(post.community.id);
                setImageUrl(post.image_url || "");

                setCommunities(communities);
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

        try {
            await updatePost(id, {
                title,
                content,
                image_url: imageUrl,
                community_id: Number(communityId),
            });

            navigate(`/posts/${id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update post.");
        }
    }

    if (loading) {
        return <h2>Loading post...</h2>;
    }

    return (
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
            <h1 className="mb-6 text-3xl font-bold">
                Edit Post
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div>
                    <label className="mb-2 block font-medium">
                        Title
                    </label>

                    <input
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Content
                    </label>

                    <textarea
                        rows={8}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Community
                    </label>

                    <select
                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                        value={communityId}
                        onChange={(e) =>
                            setCommunityId(e.target.value)
                        }
                    >
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

                <div className="space-y-4">
                    <PostImageUpload
                        imageUrl={imageUrl}
                        onUploaded={setImageUrl}
                    />

                    {imageUrl && (
                        <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 transition hover:bg-red-200"
                        >
                            Remove Image
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}