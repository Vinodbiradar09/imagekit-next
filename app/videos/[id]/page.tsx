"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
}

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/videos/${id}`);

        if (res.data?.success && res.data?.video) {
          setVideo(res.data.video);
        } else {
          setError(res.data?.message || "Failed to get the video");
          setVideo(null);
        }
      } catch (error) {
        setError("Video not found");
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
          <a href="/allvideos" className="text-blue-500 hover:underline">
            Back to All Videos
          </a>
        </div>
      </div>
    );
  if (!video)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <p className="text-gray-400 text-lg font-semibold mb-4">Video not found</p>
          <a href="/allvideos" className="text-blue-500 hover:underline">
            Back to All Videos
          </a>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">{video.title}</h1>

        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg mb-8">
          <video
            src={video.videoUrl}
            controls
            className="w-full object-contain rounded-2xl"
            preload="metadata"
          />
        </div>

        <p className="text-gray-300 mb-12 leading-relaxed whitespace-pre-wrap">{video.description}</p>

        <a
          href="/allvideos"
          className="inline-block text-blue-500 hover:underline font-semibold"
          aria-label="Back to all videos"
        >
          ← Back to All Videos
        </a>
      </div>
    </main>
  );
}
