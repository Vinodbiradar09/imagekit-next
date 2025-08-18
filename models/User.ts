import mongoose , {Schema , model , models , Document} from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser extends Document {
    _id : string;
    email : string;
    password : string;
}

const userSchema = new Schema<IUser>(
    {
        email : {
            type : String,
            required : [true , "Email is required"],
            unique : true,
            match : [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use the valid email address"],
        },
        password : {
            type : String,
            required : [true , "Password is required"],
        }
    },
    {
        timestamps : true
    }
)

userSchema.pre('save' , async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password , 10);
    }
    next();
})

const User = models?.User as mongoose.Model<IUser> || model("User" , userSchema);

export default User;