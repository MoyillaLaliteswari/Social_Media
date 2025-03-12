import React from "react";
import Link from "next/link";

interface FollowModalProps {
  title: string;
  list: { _id: string; profileImageURL?: string; username: string }[];
  onClose: () => void;
}

const FollowModal: React.FC<FollowModalProps> = ({ title, list, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto relative">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <button className="absolute top-3 right-3 text-gray-500" onClick={onClose}>
          ✖
        </button>
        {list.length > 0 ? (
          <ul className="space-y-2">
            {list.map((user) => (
              <li key={user._id} className="flex items-center space-x-3 border-b pb-2">
                <Link href={`/profile/${user._id}`} className="flex items-center space-x-3">
                  <img
                    src={user.profileImageURL || "/default-profile.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <p className="text-sm font-medium cursor-pointer hover:underline">
                    {user.username}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default FollowModal;
