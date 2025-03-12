import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProfileCard from "./profileCard";

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
    const router=useRouter();
    const Logout=async()=>{
        await axios.get("/api/users/logout");
        router.push('/login');
    };
    return (
        <div>
            <ProfileCard/>
            <div className="flex flex-col gap-6">
            {type === "home" && <ProfileCard />}
            <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
                <Link
                    href="/"
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                <span>🏠 Home page</span>
                </Link>
                <hr className="border-t-1 border-gray-200 w-36 self-center" />
                <Link
                    href="/myPosts"
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <Image
                        src="/posts.png"
                        alt="Posts"
                        width={20}
                        height={20}
                        // priority
                    />
                    <span>My Posts</span>
                </Link>
                <hr className="border-t-1 border-gray-200 w-36 self-center" />
                <Link
                    href="/updateProfile"
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <span>✏️ Update Profile</span>
                </Link>
                <hr className="border-t-1 border-gray-200 w-36 self-center" />
                <Link
                    href="/block"
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <span>🚫 Blocked Users</span>
                </Link>
                <hr className="border-t-1 border-gray-200 w-36 self-center" />
                <li className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <button onClick={Logout}>
                       🔙 Logout
                    </button>
                </li>
            </div>
        </div>
        </div>
    );
};

export default LeftMenu;
