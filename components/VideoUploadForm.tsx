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

const VideoUploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  
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

 
  const handleVideoUploadSuccess = (uploadResult : any) => {
    console.log(" Upload successful! Response:", uploadResult);
    
  
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

      return;
    }

    setIsSubmitting(true);

    try {
      console.log(" Submitting data to API:", data);
      
      const response = await axios.post<ApiResponse>('/api/video', {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,       
        thumbnailUrl: data.thumbnailUrl,
      });

      if (response.data.success) {
        
      
        form.reset();
        setVideoUploaded(false);
        setUploadProgress(0);
        
        router.push('/allvideos');
      } else {
        console.log("resss" , response.data.message);
        alert("Failed to save video: " + response.data.message);
      }
    } catch (error) {
      console.error(" Error submitting form:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      alert("Failed to save video: " + (axiosError.response?.data?.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload New Video</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
     
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Upload Video File</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileUpload
              fileType="video"
              onSuccess={handleVideoUploadSuccess}
              onProgress={handleUploadProgress}
            />
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{uploadProgress}% uploaded</p>
              </div>
            )}
            
            {videoUploaded && (
              <div className="mt-4 text-green-600 font-medium">
                 Video uploaded successfully!
              </div>
            )}
          </div>
        </div>

      
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">2. Video Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              {...form.register("title")}
              placeholder="Enter video title"
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.title && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              {...form.register("description")}
              placeholder="Enter video description"
              disabled={isSubmitting}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
            )}
          </div>

        \
          {process.env.NODE_ENV === 'development' && videoUploaded && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
              <p><strong>Video URL:</strong> {form.watch("videoUrl")}</p>
              <p><strong>Thumbnail URL:</strong> {form.watch("thumbnailUrl")}</p>
            </div>
          )}
        </div>

\
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !videoUploaded}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Video...
              </div>
            ) : (
              "💾 Save Video to Database"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUploadForm;
