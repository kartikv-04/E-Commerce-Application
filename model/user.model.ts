interface User{
    _id? : string,
    email : string, 
    password : string,
    role : UserRole,
    refreshToken? : string | null,
    createdAt? : boolean,
    updatedAt? : boolean
}

enum UserRole {
    Admin = "admin",
    User = "user"
}

import mongoose, { Schema } from "mongoose"

const userSchema = new Schema<User>({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : Object.values(UserRole), 
        required : true
    },
    refreshToken: {
      type: String,
      default: null,
    },
}, { timestamps : true} )

export const UserModel = mongoose.model<User>("User", userSchema);
