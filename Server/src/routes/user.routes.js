import express from "express"
const userRoute = express.Router();

import { GetUserProfile, UpdateUserProfile, UpdateUserPass, DeleteUserAccount } from "../controllers/userController";

userRoute.get('/getuserprofile', GetUserProfile);
userRoute.put('/updateuserprofile', UpdateUserProfile);
userRoute.put('/updateuserpass', UpdateUserPass);
userRoute.delete('/deleteuseraccount', DeleteUserAccount);