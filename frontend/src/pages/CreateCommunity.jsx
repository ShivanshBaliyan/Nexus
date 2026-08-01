import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createCommunity } from "../api/communities";

export default function CreateCommunity() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const community = await createCommunity({
                name,
                title,
                description,
            });

            navigate(`/communities/${community.name}`);
        } catch (error) {
            console.error(error);

            if (error.response?.data?.detail) {
                alert(error.response.data.detail);
            } else {
                alert("Failed to create community.");
            }
        }
    }

    return (
        <div className="flex justify-center py-10">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-3xl font-bold">
                    Create a Community
                </h1>

                <p className="mb-8 text-gray-500">
                    Start a new community and bring people together.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Community Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="e.g. reactjs"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />

                        <p className="mt-2 text-sm text-gray-500">
                            Only letters, numbers and underscores are allowed.
                        </p>
                    </div>

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
                            placeholder="A short title for your community"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            rows={8}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Tell people what your community is about..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Create Community
                    </button>
                </form>
            </div>
        </div>
    );
}