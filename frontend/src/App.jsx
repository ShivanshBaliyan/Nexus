import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Community from "./pages/Community";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import CreatePost from "./pages/CreatePost";
import CreateCommunity from "./pages/CreateCommunity";

import Layout from "./components/Layout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout>
                            <Home />
                        </Layout>
                    }
                />

                <Route
                    path="/auth/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/communities/:name"
                    element={
                        <Layout>
                            <Community />
                        </Layout>
                    }
                />
                <Route
                    path="/posts/:id"
                    element={
                        <Layout>
                            <Post />
                        </Layout>
                    }
                />

                <Route
                    path="/users/:username"
                    element={
                        <Layout>
                            <Profile />
                        </Layout>
                    }
                />

                <Route
                    path="/search"
                    element={
                        <Layout>
                            <Search />
                        </Layout>
                    }
                />

                <Route
                    path="/create-post"
                    element={
                        <Layout>
                            <CreatePost />
                        </Layout>
                    }
                />

                <Route
                    path="/create-community"
                    element={
                        <Layout>
                            <CreateCommunity />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}