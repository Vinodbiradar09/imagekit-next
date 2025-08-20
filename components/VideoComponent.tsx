import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { Play, Clock, Eye } from "lucide-react";
import { useState } from "react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getVideoPath = (url: string) => {
    if (url.startsWith('https://ik.imagekit.io/')) {
      return url.replace(process.env.NEXT_PUBLIC_URL_ENDPOINT!, '');
    }
    return url;
  };

  return (
    <div className="group relative bg-gradient-to-b from-gray-900/50 to-black/80 rounded-2xl overflow-hidden border border-gray-800/50 hover:border-gray-700 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl">
    
      <div className="relative aspect-[9/16] overflow-hidden">
        <IKVideo
          urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
          path={getVideoPath(video.videoUrl)}
          transformation={[
            {
              height: "1920",
              width: "1080",
            },
          ]}
          controls={false}
          muted
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onLoadedData={() => setIsLoaded(true)}
        />
        
      
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <Link 
              href={`/videos/${video._id}`}
              className="bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <Play className="w-6 h-6 fill-current" />
            </Link>
          </div>
        </div>

      
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

       
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          2:45
        </div>
      </div>

   
      <div className="p-6">
        <Link
          href={`/videos/${video._id}`}
          className="block group-hover:text-gray-300 transition-colors duration-300"
        >
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">
            {video.title}
          </h3>
        </Link>

        <p className="text-gray-400 text-sm line-clamp-3 mb-4 group-hover:text-gray-300 transition-colors duration-300">
          {video.description}
        </p>

      
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>1.2K views</span>
          </div>
          <span>2 days ago</span>
        </div>
      </div>

    
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
