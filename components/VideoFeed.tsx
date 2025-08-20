import { IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Play, Clock } from "lucide-react";

interface VideoFeedProps {
  videos: IVideo[];
}

export default function VideoFeed({ videos }: VideoFeedProps) {
  console.log("VideoFeed received videos:", videos);

  if (videos.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-900/50 rounded-full p-6 w-24 h-24 flex items-center justify-center mb-6">
          <Play className="w-12 h-12 text-gray-600" />
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-white">No Videos Available</h3>
        <p className="text-gray-500 max-w-md">
          Be the first to share amazing content with our community. Upload your first video today!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {videos.map((video, index) => (
        <div 
          key={video._id?.toString()} 
          className="group animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <VideoComponent video={video} />
        </div>
      ))}
    </div>
  );
}
