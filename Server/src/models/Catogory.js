import mongoose, { Schema } from "mongoose";

const catogorySchema = new Schema({
        name:{
            type: String,
            required: true,
            unique: true,
        },
    },
    {timestamps: true}
);

const Catogory = mongoose.model('Catogory', catogorySchema);
export default Catogory;