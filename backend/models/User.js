import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

export const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    number : {
        type : Number,
        required : true,
        unique : true
    }, 
    age : {
        type : Number,
        required : true, 
    }

}, {
    timestamps : true
})

const User = mongoose.model("User", userSchema)

export default User