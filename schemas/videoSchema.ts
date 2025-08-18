import {z} from "zod";

export const videoZod = z.object(
    {
        title : z.string().min(3).max(25),
        description : z.string().max(300),
        videoUrl : z.string(),
        thumbnailUrl : z.string(),
    }
)