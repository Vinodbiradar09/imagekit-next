"use client";
import VideoFeed from "@/components/VideoFeed";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, Upload } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const AllVideos = () => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await axios.get("/api/video");
        
        if (Array.isArray(res.data)) {
          setVideos(res.data);
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          setVideos(res.data.data);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Error occurred while fetching videos:", error);
        setError("Failed to fetch videos. Please try again later.");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video: any) =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-gray-900/50 rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[9/16] bg-gray-800"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-800 rounded mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <main className="min-h-screen bg-black pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-red-900/20 border border-red-800 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
              <div className="text-red-400 text-4xl">⚠️</div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-8 max-w-md">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-white mb-2">All Videos</h1>
            <p className="text-gray-400">
              {loading ? "Loading..." : `${filteredVideos.length} video${filteredVideos.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {/* Only show upload button if user is authenticated */}
          {status === "authenticated" && session && (
            <Link 
              href="/upload"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
            >
              <Upload className="w-4 h-4" />
              Upload Video
            </Link>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors duration-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-gray-900/50 border border-gray-800 text-white px-4 py-3 rounded-lg hover:border-gray-600 transition-colors duration-300">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            
            <div className="flex bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors duration-300 ${
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors duration-300 ${
                  viewMode === 'list' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <VideoFeed videos={filteredVideos} />
        )}
      </div>
    </main>
  );
};

export default AllVideos;