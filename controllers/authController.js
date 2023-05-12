import User from "../models/User.js";
import { ErrorCreator } from "../utils/FunctionError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const login = async (req,res, next) => {
    try{
        const fetchUser = await User.findOne({username : req.body.username});
        if(!fetchUser){
            return res.status(400).json({message : "Invalid Credentials !" });
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, fetchUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials !" });
        }
        const token = jwt.sign({userID : fetchUser._id, isAdmin : fetchUser.isAdmin}, process.env.JWT_TOKEN, {expiresIn : Number.MAX_SAFE_INTEGER}); // Infinity or Number.MAX_SAFE_INTEGER.
        const { password, isAdmin, ...otherDetails } = fetchUser._doc;
        res.cookie("access_token", token, {
            httpOnly : true,
        }).status(200).json({message : "You are Loggin Successfully", details : {...otherDetails}, isAdmin });
    }catch(error){
        next(error);
    }
}

const register = async (req, res, next) => {
    const user = req.body;
    try {
        const fetchUser = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] });
        if (fetchUser) {
            return res.status(400).send("Email or username Exists");
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        const newUser = new User(user);
        newUser.save();
        res.status(200).json(newUser);
    }catch (error) {
        next(error);
    }
}

export {login, register}