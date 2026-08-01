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

    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);

        try {
            const data = await search(query);

            setResults(data);
            setSearched(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-3xl font-bold">
                    Search Nexus
                </h1>

                <p className="mb-6 text-gray-500">
                    Search users, communities and posts.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex gap-3"
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) =>
                            setQuery(e.target.value)
                        }
                        placeholder="Search..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Search
                    </button>
                </form>
            </div>

            {loading && (
                <div className="rounded-xl bg-white p-6 text-center shadow">
                    Searching...
                </div>
            )}

            {!loading && searched && (
                <div className="space-y-8">
                    {/* Users */}

                    <section className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            Users
                        </h2>

                        {results.users.length === 0 ? (
                            <p className="text-gray-500">
                                No users found.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {results.users.map((user) => (
                                    <Link
                                        key={user.id}
                                        to={`/users/${user.username}`}
                                        className="block rounded-lg border p-3 transition hover:bg-gray-50"
                                    >
                                        👤 {user.username}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Communities */}

                    <section className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            Communities
                        </h2>

                        {results.communities.length === 0 ? (
                            <p className="text-gray-500">
                                No communities found.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {results.communities.map((community) => (
                                    <Link
                                        key={community.id}
                                        to={`/communities/${community.name}`}
                                        className="block rounded-lg border p-3 transition hover:bg-gray-50"
                                    >
                                        👥 {community.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Posts */}

                    <section className="rounded-xl bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            Posts
                        </h2>

                        {results.posts.length === 0 ? (
                            <p className="text-gray-500">
                                No posts found.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {results.posts.map((post) => (
                                    <Link
                                        key={post.id}
                                        to={`/posts/${post.id}`}
                                        className="block rounded-lg border p-3 transition hover:bg-gray-50"
                                    >
                                        📄 {post.title}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}