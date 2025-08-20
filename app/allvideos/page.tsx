"use client";
import VideoFeed from "@/components/VideoFeed";
import { ApiResponse } from "@/lib/ApiResponse";
import axios from "axios";
import React, { useState, useEffect } from "react";

const AllVideos = () => {
  const [loading, setLoading] = useState(true); 
  const [videos, setVideos] = useState<any>([]); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      
      try {
      
        const res = await axios.get<ApiResponse>("/api/video");
        
        console.log("API Response:", res.data);
        
       
        if (Array.isArray(res.data)) {
          setVideos(res.data);
        } else {
          setVideos([]);
        }
        
      } catch (error) {
        console.error("Error occurred while fetching videos:", error);
        setError("Failed to fetch videos");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading videos...</div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-600">
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Videos</h1>
      <VideoFeed videos={videos} />
    </div>
  );
};

export default AllVideos;
