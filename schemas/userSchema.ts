import { z } from "zod";

export const userZod = z.object({
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6 , {message : "Password must have atleast six characters"})
})