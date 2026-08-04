import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getCommunities } from "../api/communities";
import { createPost } from "../api/posts";
import PostImageUpload from "../components/PostImageUpload";

export default function CreatePost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [communityId, setCommunityId] = useState("");
    const [imageUrl, setImageUrl] = useState("");
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
                image_url: imageUrl,
                community_id: Number(communityId),
            });

            toast.success("Post created successfully!");

            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post.");
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <h2 className="text-lg text-gray-600">
                    Loading communities...
                </h2>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-3xl font-bold">
                    Create a Post
                </h1>

                <p className="mb-8 text-gray-500">
                    Share something with your community.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Enter a title..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Community
                        </label>

                        <select
                            value={communityId}
                            onChange={(e) =>
                                setCommunityId(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        >
                            <option value="">
                                Select a community
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

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Content
                        </label>

                        <textarea
                            rows={10}
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            placeholder="What's on your mind?"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <PostImageUpload
                        imageUrl={imageUrl}
                        onUploaded={setImageUrl}
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Create Post
                    </button>
                </form>
            </div>
        </div>
    );
}