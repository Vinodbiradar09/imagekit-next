"use client";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { videoSchema } from '@/schemas/videoSchema';
import axios, { AxiosError } from "axios";
import { ApiResponse } from '@/lib/ApiResponse';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FileUpload from './FileUpload';
import { Upload, CheckCircle, Play, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const VideoUploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadedVideoData, setUploadedVideoData] = useState<any>(null);
  
  const { data: session } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    }
  });

  const handleVideoUploadSuccess = (uploadResult: any) => {
    console.log("✅ Upload successful! Response:", uploadResult);
    
    setUploadedVideoData(uploadResult);
    form.setValue("videoUrl", uploadResult.url);
    form.setValue("thumbnailUrl", uploadResult.thumbnailUrl || uploadResult.url);
    
    setVideoUploaded(true);
    setUploadProgress(100);
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: z.infer<typeof videoSchema>) => {
    if (!session) {
      alert("Please login to upload videos");
      router.push("/login");
      return;
    }

    if (!videoUploaded || !data.videoUrl) {
      alert("Please upload a video first");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/videos', {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
      });

      if (response.data.success) {
        // Reset form
        form.reset();
        setVideoUploaded(false);
        setUploadProgress(0);
        setUploadedVideoData(null);
        
        router.push('/allvideos');
      } else {
        alert("Failed to save video: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      alert("Failed to save video: " + (axiosError.response?.data?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/allvideos"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-4">Upload New Video</h1>
          <p className="text-gray-400 text-lg">Share your content with the world</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white text-black rounded-full p-2">
                  <Upload className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">Upload Video</h2>
              </div>

              <FileUpload
                fileType="video"
                onSuccess={handleVideoUploadSuccess}
                onProgress={handleUploadProgress}
              />

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {videoUploaded && (
                <div className="mt-6 bg-green-900/20 border border-green-800 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Video uploaded successfully!</span>
                </div>
              )}
            </div>

            {/* Preview */}
            {videoUploaded && uploadedVideoData && (
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Preview
                </h3>
                <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={uploadedVideoData.thumbnailUrl || uploadedVideoData.url} 
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Video Details</h2>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Title *</label>
                <input
                  type="text"
                  {...form.register("title")}
                  placeholder="Enter an engaging title"
                  disabled={isSubmitting}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-300"
                />
                {form.formState.errors.title && (
                  <p className="mt-2 text-red-400 text-sm">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description *</label>
                <textarea
                  {...form.register("description")}
                  placeholder="Describe your video..."
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-300 resize-none"
                />
                {form.formState.errors.description && (
                  <p className="mt-2 text-red-400 text-sm">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && videoUploaded && (
                <div className="bg-gray-900/50 rounded-lg p-4 text-xs text-gray-400">
                  <p className="font-semibold mb-2">Debug Info:</p>
                  <p><strong>Video URL:</strong> {form.watch("videoUrl")}</p>
                  <p><strong>Thumbnail URL:</strong> {form.watch("thumbnailUrl")}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !videoUploaded}
                className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Publish Video
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoUploadForm;
