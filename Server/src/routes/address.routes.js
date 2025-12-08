import express from "express";
import { addAddress, getAddresses, updateAddress, deleteAddress} from "../controllers/addressController.js";
import authenticateUser from "../middleware/authenticateUser.js";

const addressRouter = express.Router();

addressRouter.post("/add", authenticateUser, addAddress);
addressRouter.get("/", authenticateUser, getAddresses);
addressRouter.put("/update/:addressId", authenticateUser, updateAddress);
addressRouter.delete("/delete/:addressId", authenticateUser, deleteAddress);

export default addressRouter;
