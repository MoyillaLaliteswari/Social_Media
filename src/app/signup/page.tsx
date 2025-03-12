"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const onSignUp = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            toast.success("Signup successful!");
            // router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Signup failed!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setButtonDisabled(
            !(user.email.length > 0 && user.password.length > 0 && user.username.length > 0)
        );
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
                    {loading ? "Processing..." : "Sign Up"}
                </h1>
                
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        User Name
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder="Enter your username"
                        className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                </div>

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
                    onClick={onSignUp}
                    disabled={buttonDisabled || loading}
                    className={`w-full py-2 text-white rounded-md transition-all ${
                        buttonDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                >
                    {loading ? "Processing..." : "Sign Up"}
                </button>

                <div className="text-center mt-4">
                <Link href="/login">
    <span className="text-indigo-600 hover:underline">
        Already have an account? Login
    </span>
</Link>

                </div>
            </div>
        </div>
    );
}
