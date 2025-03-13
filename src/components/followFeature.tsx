import React from "react";
import Link from "next/link";

interface Follower {
  _id: string;
  username: string;
  profileImageURL: string;
}

interface FollowModalProps {
  title: string;
  list: Follower[];
  onClose: () => void;
}

const FollowModal = ({ title, list, onClose }: FollowModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            className="text-gray-600 hover:text-gray-900 text-2xl focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <ul className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {list.map((user) => (
            <li
              key={user._id}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="relative">
                <img
                  src={user.profileImageURL}
                  alt={user.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="ml-4">
                <Link
                  href={`/profile/${user._id}`}
                  className="text-lg font-medium text-gray-800 hover:underline hover:text-blue-600"
                >
                  {user.username}
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="mt-6 w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowModal;
