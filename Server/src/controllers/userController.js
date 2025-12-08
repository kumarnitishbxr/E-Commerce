import User from "../Models/User";
import bcrypt from 'bcrypt'
import redisClient from "../config/Redis";

const GetUserProfile = async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const UpdateUserProfile = async(req, res)=>{
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, email, phone } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const UpdateUserPass = async(req, res)=>{
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        // Optional: invalidate old refresh token
        await redisClient.del(`refresh_${user._id}`);

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const DeleteUserAccount = async(req, res)=>{
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.user.id);
        await redisClient.del(`refresh_${req.user.id}`);

        res.status(200).json({ message: "User account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export{GetUserProfile, UpdateUserProfile, UpdateUserPass, DeleteUserAccount};