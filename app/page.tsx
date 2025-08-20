"use client";
import Link from "next/link";
import { Play, Upload, Eye, Shield, Zap, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import VideoFeed from "@/components/VideoFeed";

export default function Home() {
  const { data: session } = useSession();
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVideos = async () => {
      try {
        console.log("🚀 Fetching featured videos...");
        const response = await axios.get("/api/video");
        
        // ✅ Fixed: Better response handling with validation
        console.log("📦 API Response:", response.data);
        console.log("🔍 Response type:", typeof response.data);
        console.log("📋 Is array:", Array.isArray(response.data));
        
        let videosData = [];
        
        if (Array.isArray(response.data)) {
          videosData = response.data;
        } else if (response.data && Array.isArray(response.data.videos)) {
          videosData = response.data.videos;
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
          videosData = response.data.data;
        }
        
        // ✅ Take only first 6 videos and ensure they have required fields
        const validVideos = videosData
          .filter(video => video && video._id && video.title && video.videoUrl)
          .slice(0, 6);
          
        console.log("✅ Setting featured videos:", validVideos);
        setFeaturedVideos(validVideos);
      } catch (error) {
        console.error("❌ Failed to fetch videos:", error);
        setFeaturedVideos([]); // ✅ Always set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedVideos();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-50"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-bold mb-8 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Video Reels Pro
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light leading-relaxed">
            Experience the future of video sharing with AI-powered tools. 
            <br className="hidden md:block" />
            Create, upload, and discover stunning content.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href={session ? "/upload" : "/login"}
              className="group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-white/20"
            >
              <Upload className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Creating
            </Link>
            <Link 
              href="/allvideos"
              className="group border-2 border-gray-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Explore Videos
            </Link>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Why Choose Reels Pro?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Powered Editing",
                description: "Transform your videos effortlessly with cutting-edge AI technology and automatic enhancements.",
                color: "from-blue-500/20 to-purple-500/20"
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Ultra HD Quality",
                description: "Experience crystal-clear videos in stunning 4K resolution with optimized streaming technology.",
                color: "from-green-500/20 to-blue-500/20"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Fast",
                description: "Your content is protected with enterprise-grade security and lightning-fast global delivery.",
                color: "from-purple-500/20 to-pink-500/20"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="bg-gray-800 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-gray-700 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Featured Reels
            </h2>
            <Link 
              href="/allvideos"
              className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              View All <Star className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-900/50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[9/16] bg-gray-800"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredVideos.length > 0 ? (
            <VideoFeed videos={featuredVideos} />
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-900/50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-400">No Videos Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Be the first to share amazing content with our community.
              </p>
              <Link 
                href={session ? "/upload" : "/login"}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
              >
                <Upload className="w-4 h-4" />
                Upload First Video
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-t from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of creators sharing their stories through video.
          </p>
          <Link 
            href={session ? "/upload" : "/register"}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-gray-700 hover:to-gray-900 hover:border-gray-600 transition-all duration-300 shadow-2xl"
          >
            <Star className="w-5 h-5" />
            {session ? "Start Creating" : "Join Now"}
          </Link>
        </div>
      </section>
    </main>
  );
}