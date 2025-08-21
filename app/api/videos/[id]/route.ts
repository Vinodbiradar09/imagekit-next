import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  await dbConnect();
  const body = await request.json();

  try {
    const video = await Video.create(body);
    return NextResponse.json(
      { message: "Video created", success: true, data: video },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create video", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const { pathname } = new URL(request.url);
  const parts = pathname.split('/');
  const id = parts[parts.length - 1]; // get dynamic id from URL

  if (!id) {
    return NextResponse.json(
      { message: "ID is required", success: false },
      { status: 400 }
    );
  }

  try {
    const video = await Video.findById(id).lean();
    if (!video) {
      return NextResponse.json(
        { message: "Video not found", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, video }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}

