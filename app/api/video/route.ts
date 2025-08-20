import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { IVideo } from "@/models/Video";
import { videoSchema } from "@/schemas/videoSchema";

export async function GET(request: NextRequest) {
  try {
  
    await dbConnect();
    
    console.log(" Fetching videos");
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    
    console.log(`Found ${videos.length} videos`);
    
  
    return NextResponse.json(videos || [], { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error(" Error while getting the videos:", error);
    
   
    return NextResponse.json(
      {
        message: "Internal server issue",
        success: false,
        videos: [] 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
        }
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized User, please login",
          success: false,
        },
        { status: 401 } 
      );
    }

    await dbConnect();
    const body: IVideo = await request.json();

    const validationResult = videoSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = Object.values(validationResult.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean);

      return NextResponse.json(
        {
          message: errors.length > 0 ? errors.join(", ") : "Validation failed",
          success: false,
        },
        { status: 400 }
      );
    }

    const video = await Video.create({
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      controls: body.controls ?? true,
      transformation: {
        height: body.transformation?.height ?? 1920,
        width: body.transformation?.width ?? 1080,
        quality: body.transformation?.quality ?? 100,
      },
    });

    if (!video) {
      return NextResponse.json(
        {
          message: "Failed to create video",
          success: false,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        message: "Video created successfully",
        success: true,
        data: video,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error while creating the video:", error);
    return NextResponse.json(
      { 
        message: "Internal server error", 
        success: false 
      },
      { status: 500 }
    );
  }
}
