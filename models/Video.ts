import mongoose , {Schema , model , models , Document} from "mongoose";

export const VIDEO_DIMENSIONS = {
    width : 1080,
    height : 1920,
} as const;

export interface IVideo extends Document {
    title : string,
    description : string,
    videoUrl : string,
    thumbnailUrl : string,
    controls? : boolean,
    transformation? : {
        height : number,
        width : number,
        quality? : number,
    }
}

const videoSchema = new Schema<IVideo>(
    {
        title : {
            type : String,
            required : [true , "Title is required"],
            minLength : [3 , "Minimum length of the title must be atleast 3 chars"],
            maxLength : [25 , "Maximum length of the title must be not more than 25 chars"]
        },
        description : {
            type : String,
            required : [true , "Description must be required"],
            maxLength : [300 , "Description must be not more than 300 chars"],
        },
        videoUrl : {
            type : String,
            required : [true , "Video-url is required"],
        },
        thumbnailUrl : {
            type : String,
            required : [true , "Thumbnail-url is required"],
        },
        controls : {
            type : Boolean,
            default : true
        },
        transformation : {
            height : {
                type : Number,
                default : VIDEO_DIMENSIONS.height
            },
            width : {
                type : Number,
                default : VIDEO_DIMENSIONS.width
            },
            quality: { type: Number, min: 1, max: 100 },
        }
    },
    {
        timestamps : true
    }
)

const Video = models.Video as mongoose.Model<IVideo> || model("Video" , videoSchema);

export default Video;