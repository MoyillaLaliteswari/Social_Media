import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Volume2, VolumeX, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
  _id: number;
  user: string;
  img: string;
  media: string;
  mediaType: "image" | "video";
}

interface StoryModalProps {
  stories: Story[];
  currentIndex: number;
  setCurrentIndex?: (index: number) => void; // ✅ Made optional
  onClose: () => void;
}


export default function StoryModal({ stories, currentIndex, setCurrentIndex, onClose }: StoryModalProps) {
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0); // Reset progress for each new story

    if (currentStory.mediaType === "image") {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            goToNextStory();
            return 100;
          }
          return prev + 2; // Faster transition
        });
      }, 50);
      return () => clearInterval(timer);
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0; // Reset video
      videoRef.current.play();
      videoRef.current.onloadedmetadata = () => {
        const duration = videoRef.current?.duration || 5;
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              goToNextStory();
              return 100;
            }
            return prev + 100 / (duration * 20); // Adjust based on video length
          });
        }, 50);
        return () => clearInterval(interval);
      };
    }
  }, [currentIndex]);

  useEffect(() => {
    if (progress === 100 && currentIndex === stories.length - 1) {
      onClose();
    }
  }, [progress]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const goToNextStory = () => {
    if (setCurrentIndex && currentIndex < stories.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 0); // Defer state update to avoid update-in-render error
    } else {
      onClose();
    }
  };
  
  
  const goToPrevStory = () => {
    if (setCurrentIndex && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
        {/* Progress Bar */}
        <div className="absolute top-2 left-2 right-2 h-1 bg-gray-700 rounded-full">
          <motion.div className="h-full bg-white rounded-full" animate={{ width: `${progress}%` }} />
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 bg-gray-900 text-white p-2 rounded-full hover:bg-opacity-80">
          <X size={24} />
        </button>

        {/* User Info */}
        <div className="absolute top-4 left-4 flex items-center space-x-3 text-white">
          <img src={currentStory.img} alt="User" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-sm font-medium">{currentStory.user}</span>
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button onClick={goToPrevStory} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black bg-opacity-50 rounded-full">
            <ChevronLeft size={24} />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button onClick={goToNextStory} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 bg-black bg-opacity-50 rounded-full">
            <ChevronRight size={24} />
          </button>
        )}

        {/* Story Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          {currentStory.mediaType === "image" ? (
            <motion.img src={currentStory.media} alt="Story" className="max-h-[80vh] object-contain rounded-lg" />
          ) : (
            <motion.video
              ref={videoRef}
              src={currentStory.media}
              autoPlay
              muted={isMuted}
              playsInline
              className="max-h-[80vh] object-contain rounded-lg"
              onEnded={goToNextStory}
            />
          )}
        </div>

        {/* Video Controls */}
        {currentStory.mediaType === "video" && (
          <div className="absolute bottom-4 left-4 flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white bg-gray-900 p-2 rounded-full hover:bg-opacity-80">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={toggleMute} className="text-white bg-gray-900 p-2 rounded-full hover:bg-opacity-80">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
