

// const addressSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     fullName: String,
//     phone: String,

//     street: String,
//     city: String,
//     state: String,
//     country: String,
//     postalCode: String,
//   },
//   { timestamps: true }
// );

// const Address = mongoose.model('Address', addressSchema);
// export default Address;


import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
    },
    street: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    state: { 
      type: String 
    },
    country: { 
      type: String, 
      required: true 
    },
    postalCode: { 
      type: String 
    },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);

export default Address;
