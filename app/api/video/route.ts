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
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error while getting the videos ", error);
    return NextResponse.json(
      {
        message: "Internal server issue",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
        console.log("ses" , session);
      return NextResponse.json(
        {
          message: "Unauthorized User , please login",
          success: false,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const body: IVideo = await request.json();

    const validationResult = videoSchema.safeParse({ body });
    if (!validationResult.success) {
      const errors = validationResult.error.format()._errors || [];
      return NextResponse.json(
        {
          message:
            errors.length > 0
              ? errors.join(", ")
              : "All the fields are required",
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
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    });

    if (!video) {
      return NextResponse.json(
        {
          message: "Failed to create a video",
          success: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Error while creating the video", error);
    return NextResponse.json(
      { message: "Failed to create video" , success : false },
      { status: 500 }
    );
  }
}

























// okay now we have to handle the video upload in the image-kit ,
// the frontend has authenticated with image-kit cred , how when he uploads the video the video will get uploaded in the imagekit and it sends some detail of the video now in frontend we will make one form were we collect all the info like title and all and the details sent by the image-kit and merges both and save in db
