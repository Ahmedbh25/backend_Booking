import mongoose from "mongoose";
import User from "../models/User.js";

// GET ALL USERS.
const getUsers = async(req, res, next)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(error){
        next(error);
    }
}

// GET USER BY ID.
const getUser = async(req, res, next)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
            return res.status(404).json({ message: 'Invalid user ID'});
        }
        const user = await User.findById(req.params.userID);
        if(!user){
            return res.status(400).json("User Not Found !");
        }
        res.status(200).json(user);
    }catch(error){
        next(error);
    }
}

// DETELE USER.
const deleteUser = async(req, res, next)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
            return res.status(404).json({ message: 'Invalid user ID'});
        }
        const user = await User.findById(req.params.userID);
        if(!user){
            return res.status(400).json("User Not Found !");
        }
        await User.findByIdAndDelete(req.params.userID)
        res.status(200).json("User Deleted Successfully");
    }catch(error){
        next(error);
    }
}

// UPDATE USER.
const updateUser = async(req, res, next)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.userID)) {
            return res.status(404).json({ message: 'Invalid user ID'});
        }
        const user = await User.findById(req.params.userID);
        if(!user){
            return res.status(400).json("User Not Found !");
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.userID, { $set : req.body }, {new : true});
        res.status(200).json({message: "User Updated Successfully", updatedUser});
    }catch(error){
        next(error);
    }
}

export {updateUser, deleteUser, getUser, getUsers};