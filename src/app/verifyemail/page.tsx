"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyUserEmail = useCallback(async () => {
    if (!token) return;
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (err) {
      setError(true);
      console.log((err as any)?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      setToken(urlToken);
    } else {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token, verifyUserEmail]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6">
      {loading ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-600">
            Verifying...
          </h1>
          <div className="mt-6 w-10 sm:w-12 h-10 sm:h-12 border-4 border-t-4 border-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : verified ? (
        <div className="bg-green-50 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-green-600">
            Email Verified!
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Your email has been successfully verified.
          </p>
          <Link href="/login">
            <button className="mt-6 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-400">
              Login
            </button>
          </Link>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 sm:p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-red-600">
            Oops, Something went wrong!
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Please check the link or try again later.
          </p>
        </div>
      ) : null}
    </div>
  );
}