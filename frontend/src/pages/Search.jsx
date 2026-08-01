import { useState } from "react";
import { Link } from "react-router-dom";

import { search } from "../api/search";

export default function Search() {
    const [query, setQuery] = useState("");

    const [results, setResults] = useState({
        users: [],
        communities: [],
        posts: [],
    });

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await search(query);
            setResults(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Search</h1>

            <form onSubmit={handleSubmit}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                />

                <button type="submit">
                    Search
                </button>
            </form>

            <hr />

            <h2>Users</h2>

            {results.users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {results.users.map((user) => (
                        <li key={user.id}>
                            <Link to={`/users/${user.username}`}>
                                {user.username}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Communities</h2>

            {results.communities.length === 0 ? (
                <p>No communities found.</p>
            ) : (
                <ul>
                    {results.communities.map((community) => (
                        <li key={community.id}>
                            <Link to={`/communities/${community.name}`}>
                                {community.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <hr />

            <h2>Posts</h2>

            {results.posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                results.posts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/posts/${post.id}`}
                        style={{
                            display: "block",
                            marginBottom: "1rem",
                        }}
                    >
                        {post.title}
                    </Link>
                ))
            )}
        </div>
    );
}