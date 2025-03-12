"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login Success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error: any) {
            console.log("Login Failed", error.message);
            toast.error(error.response?.data?.error || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(!(user.email && user.password));
    }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            {/* Enhanced Background Animation */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-purple-300 to-pink-300 opacity-30 rounded-full filter blur-3xl animate-spin-slow top-0 left-0"></div>
                <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-indigo-300 to-purple-300 opacity-30 rounded-full filter blur-2xl animate-pulse-slow bottom-10 right-10"></div>
                <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-300 to-indigo-300 opacity-30 rounded-full filter blur-2xl animate-float top-20 right-20"></div>
            </div>

            <div className="bg-white shadow-xl rounded-lg p-8 z-10 max-w-md w-full relative">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {loading ? "Processing..." : "Login"}
                </h1>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Enter your email"
                        className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Enter your password"
                        className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

                <button
                    onClick={onLogin}
                    disabled={buttonDisabled || loading}
                    className={`w-full py-2 text-white rounded-md transition-all ${
                        buttonDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {loading ? "Processing..." : "Login"}
                </button>

                <div className="text-center mt-4">
                    <button
                        onClick={() => router.push("/forgotPassword")}
                        className="text-blue-500 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                <div className="text-center mt-4">
                    <Link href="/signup" className="text-indigo-600 hover:underline">
                        Don't have an account? Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
