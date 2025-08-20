"use client"; 

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    setError(null);
    
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Failed to get authentication");
      }
      
      const authData = await authRes.json();
      console.log("Auth response:", authData);

   
      const { authenticationParameters, publicKey } = authData;
      const { signature, expire, token } = authenticationParameters;

      const res = await upload({
        file,
        fileName: `${Date.now()}-${file.name}`,
        publicKey: publicKey, 
        signature: signature, 
        expire: expire,       
        token: token,         
        folder: "/videos",    
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      console.log(" Upload successful! Response:", res);
      onSuccess(res);
    } catch (error) {
      console.error(" Upload failed:", error);
      
      if (error instanceof ImageKitAbortError) {
        setError("Upload was cancelled");
      } else if (error instanceof ImageKitInvalidRequestError) {
        setError("Invalid upload request: " + error.message);
      } else if (error instanceof ImageKitServerError) {
        setError("Server error during upload: " + error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError("Network error during upload: " + error.message);
      } else {
        setError("Upload failed: " + (error as Error).message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {uploading && (
        <div className="mt-2 text-center">
          <span className="text-blue-600">Uploading...</span>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-red-600 text-sm">
           {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
