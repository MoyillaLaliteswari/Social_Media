"use client"
import axios from "axios"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string>("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            if (!token) return; // Prevent unnecessary API calls
            const response = await axios.post('/api/users/verifyemail', { token });
            if (response.status === 200) {
                setVerified(true);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
            console.error("Verification error:", err);
        }
    }

    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
        }
    }, [searchParams]);

    useEffect(() => {
        if (token) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div>
            <h1>Verify Email</h1>
            <h2>{token ? `${token}` : "No Token"}</h2>

            {verified && (
                <div>
                    <h2>Email Verified</h2>
                    <Link href="/login">Login</Link>
                </div>
            )}
            {error && (
                <div>
                    <h2>Verification Failed</h2>
                </div>
            )}
        </div>
    );
}
