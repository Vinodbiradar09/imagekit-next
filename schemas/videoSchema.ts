import {z} from "zod";

export const videoSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().min(1, "Description is required").max(1000, "Description too long"),
    videoUrl: z.string().url("Invalid video URL"),
    thumbnailUrl: z.string().url("Invalid thumbnail URL"),
})