"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/login", user);
      toast.success("Login successful");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <div className="h-screen flex items-center justify-center relative bg-darkBlue">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F] via-[#011B33] to-[#000A1F]"></div>

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20"
      >
        <h1 className="text-2xl font-extrabold text-white text-center">
          Welcome Back 👋
        </h1>
        <p className="text-gray-400 text-center mt-1">
          Log in to continue your journey
        </p>

        <div className="mt-6 flex flex-col gap-4">

          {/* Email Input */}
          <div className="relative w-full mt-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full py-3 px-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50 focus:outline-none transition duration-300"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full py-3 px-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50 focus:outline-none transition duration-300"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer transition duration-300 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
            </span>
          </div>

          {/* Login Button */}
          <button
            className={`mt-5 tracking-wide font-semibold w-full py-3 rounded-lg transition-all duration-300 flex items-center justify-center ${
              buttonDisabled || loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#003B6F] to-[#0066CC] hover:from-[#004F8E] hover:to-[#007BFF] text-white"
            }`}
            disabled={buttonDisabled || loading}
            onClick={(e) => {
              e.preventDefault();
              if (!buttonDisabled && !loading) onLogin();
            }}
          >
            {loading ? (
              <motion.div
                className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              ></motion.div>
            ) : (
              <span>Login</span>
            )}
          </button>
        </div>

        {/* Links */}
        <p className="mt-4 text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup">
            <span className="text-white font-semibold cursor-pointer hover:underline">
              Sign Up
            </span>
          </Link>
        </p>

        <p className="mt-2 text-sm text-center text-gray-400">
          <Link href="/forgotpassword">
            <span className="text-white font-semibold cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
