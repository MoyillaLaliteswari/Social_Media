import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Volume2, VolumeX, Pause, Play } from "lucide-react";

interface Story {
  _id: number;
  user: string;
  img: string;
  media: string;
  mediaType: "image" | "video";
}

interface StoryModalProps {
  story: Story;
  onClose: () => void;
}

export default function StoryModal({ story, onClose }: StoryModalProps) {
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (story.mediaType === "image") {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [story.mediaType]);

  useEffect(() => {
    if (progress === 100) {
      onClose();
    }
  }, [progress, onClose]);

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-[400px] h-[90vh] flex flex-col bg-black rounded-lg shadow-xl overflow-hidden"
      >
        {/* Progress Bar for Image Stories */}
        {story.mediaType === "image" && (
          <div className="absolute top-2 left-2 right-2 h-1 bg-gray-700 rounded-full">
            <motion.div
              className="h-full bg-white rounded-full"
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-900 bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition"
        >
          <X size={24} />
        </button>

        {/* User Info */}
        <div className="absolute top-4 left-4 flex items-center space-x-3 text-white">
          <img
            src={story.img}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm font-medium">{story.user}</span>
        </div>

        {/* Video Controls for Mute/Unmute & Play/Pause */}
        {story.mediaType === "video" && (
          <div className="absolute top-4 right-12 flex space-x-2">
            <button
              onClick={toggleMute}
              className="bg-gray-900 bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <button
              onClick={togglePlay}
              className="bg-gray-900 bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        )}

        {/* Media Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          {story.mediaType === "image" ? (
            <motion.img
              src={story.media}
              alt="Story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
          ) : (
            <motion.video
              ref={videoRef}
              src={story.media}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
