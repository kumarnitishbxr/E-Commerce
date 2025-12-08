import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        name:{
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 50
        },
        email:{
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        password:{
            type: String,
            required: true,
            minLength: 6,
        },
        role:{
            type: String,
            enum: ["user","admin"],
            default: "user"
        },
        contact:{
            type: String,
        },
        addresses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Address",
            },
        ],
    },
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;