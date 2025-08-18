import { dbConnect } from "@/lib/db";
import {NextRequest , NextResponse} from "next/server";
import User from "@/models/User";

export async function POST(request : NextRequest) {
    const {email , password} = await request.json();
    try {
        await dbConnect();
        if(!email || !password){
          return NextResponse.json(
                {
                    message : "Email and password are required to register the user",
                    success : false,
                } , {status : 400}
            )
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
           return NextResponse.json(
                {
                    message : "User already registered",
                    success : false,
                } , {status : 403}
            )
        }

        const user = await User.create(
            {
                email,
                password,
            }
        )

        if(!user){
           return NextResponse.json(
                {
                    message : "Failed to register the user due to internal server error",
                    success : false,
                }, {status : 409}
            )
        }

        return NextResponse.json(
            {
                message : "User registered successfully",
                success : true,
            }, {status : 200}
        )
        
    } catch (error) {
        console.error("Error while registering the user" , error);
        return NextResponse.json(
            {
                message : "Internal server error user registration has failed",
                success : false,
            }, {status : 500}
        )
    }
}
