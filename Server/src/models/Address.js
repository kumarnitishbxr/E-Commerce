import mongoose, { mongo } from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: String,
    phone: String,

    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);
export default Address;