"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function NewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [equal, setEqual] = useState(true);

  useEffect(() => {
    const emailId = searchParams.get("email"); // Retrieve email query parameter
    if (emailId) {
      setEmail(emailId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (newPassword === confirmPassword && newPassword.length > 7) {
      setEqual(false);
    } else {
      setEqual(true);
    }
  }, [confirmPassword, newPassword]);

  const onResetPassword = async () => {
    try {
      const response = await axios.post("/api/users/newpassword", { email, newPassword });
      console.log(response);
      router.push("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Reset Your Password</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="newpassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newpassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmpassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmpassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            disabled={equal}
            onClick={onResetPassword}
            className={`w-full px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
              ${equal ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"}`}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

function NewPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordPage />
    </Suspense>
  );
}

export default NewPasswordPageWrapper;