"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password.length > 5 && user.username));
  }, [user]);

  const onSignUp = async () => {
    setLoading(true);
    try {
      await axios.post("/api/users/signup", user);
      toast.success("Verify email sent! Check your inbox.", { duration: 6000 });
      toast.success("Account created successfully! Please verify to log in.", { duration: 6000 });
      router.push("/login");
    } catch (error) {
      console.log(error);
      const errorMessage = (error as any)?.response?.data?.message || "Try signing up with a unique username and email";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative bg-darkBlue">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F] via-[#011B33] to-[#000A1F]"></div>

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-lg p-8 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20"
      >
        {/* Signup Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white">Join Us 🎉</h1>
            <p className="text-gray-400 mt-1">Create an account to explore more!</p>
          </div>

          <div className="w-full mt-6">
            <div className="max-w-xs mx-auto flex flex-col gap-4 text-white">
              {/* Username Input */}
              <input
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-white/50 focus:outline-none transition duration-300"
                type="text"
                placeholder="Enter your username"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />

              {/* Email Input */}
              <input
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-white/50 focus:outline-none transition duration-300"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />

              {/* Password Input */}
              <div className="relative w-full">
                <input
                  className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/30 placeholder-gray-400 text-white focus:ring-2 focus:ring-white/50 focus:outline-none transition duration-300"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer transition duration-300 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                </span>
              </div>

              {/* Signup Button */}
              <button
                className={`mt-5 tracking-wide font-semibold w-full py-3 rounded-md transition-all duration-300 flex items-center justify-center ${
                  buttonDisabled || loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#003B6F] to-[#0066CC] hover:from-[#004F8E] hover:to-[#007BFF] text-white"
                }`}
                disabled={buttonDisabled || loading}
                onClick={(e) => {
                  e.preventDefault();
                  if (!buttonDisabled && !loading) onSignUp();
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
                  <span>Sign Up</span>
                )}
              </button>

              {/* Links */}
              <p className="mt-4 text-xs text-gray-400 text-center">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-white font-semibold cursor-pointer hover:underline">Log In</span>
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
