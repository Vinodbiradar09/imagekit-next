"use client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState, useCallback } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType = "video" }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
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

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      if (!authRes.ok) {
        throw new Error("Failed to get authentication");
      }

      const authData = await authRes.json();
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

      console.log("✅ Upload successful! Response:", res);
      onSuccess(res);
    } catch (error) {
      console.error("❌ Upload failed:", error);

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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // ✅ Fixed: Proper file access from FileList
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]); // ✅ Fixed: Access first file properly
    }
  }, []);

  // ✅ Fixed: Proper file access from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]); // ✅ Fixed: Access first file properly
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : uploading 
              ? 'border-gray-600 bg-gray-900/30 cursor-not-allowed' 
              : 'border-gray-700 bg-gray-900/20 hover:border-gray-600 hover:bg-gray-900/30'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? openFileDialog : undefined}
      >
        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <div>
              <p className="text-white font-medium">Uploading...</p>
              <p className="text-gray-400 text-sm">Please wait while we process your video</p>
            </div>
          </div>
        ) : selectedFile && !error ? (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <div>
              <p className="text-green-400 font-medium">Upload Complete!</p>
              <p className="text-gray-400 text-sm truncate">{selectedFile.name}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              Upload Different File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-white font-medium mb-2">
                Drop your {fileType} here, or click to browse
              </p>
              <p className="text-gray-400 text-sm">
                Supports {fileType === "video" ? "MP4, MOV, AVI" : "JPG, PNG, GIF"} up to 100MB
              </p>
            </div>
          </div>
        )}

        {dragActive && (
          <div className="absolute inset-0 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <p className="text-blue-400 font-medium">Drop your file here</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={resetUpload}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors duration-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;