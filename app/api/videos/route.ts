import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth/next";
import { NextResponse ,NextRequest} from "next/server";


export async function GET(){
    try{
        await connectToDatabase()
        const videos= await Video.find({}).sort({createdAt: -1}).lean()
        if(!videos || videos.length === 0){
            return NextResponse.json([], {status:200})
        }
        return NextResponse.json(videos)

    }catch(error){
        return NextResponse.json(
            {error:"failed to get the videos"},
            {status:500}
    )

    }
}

export async function POST(request: NextRequest){
    try{
        const session = await getServerSession(authOptions); //allow logged in user
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          }
        await connectToDatabase()
        const body: IVideo = await request.json();     
        const videos= await Video.find({}).sort({createdAt: -1}).lean()
        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Missing required feilds"},
                {status:400}
            )
        }

        // Create new video with default values
        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
             height: 1920,
             width: 1080,
             quality: body.transformation?.quality ?? 100,
            }
        };
        const newVideo = await Video.create(videoData);
        return NextResponse.json(newVideo);
    }catch(error){
        return NextResponse.json(
            {error:"failed to get the videos"},
            {status:500}
    )
    }
}