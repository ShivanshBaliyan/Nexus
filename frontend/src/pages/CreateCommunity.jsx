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
            alert("Failed to create community.");
        }
    }

    return (
        <div>
            <h1>Create Community</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Create Community
                </button>
            </form>
        </div>
    );
}