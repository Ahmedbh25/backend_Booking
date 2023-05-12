import mongoose from "mongoose";
import User from "../models/User.js";

const ErrorCreator = (err, status)=>{
    const error = new Error();
    error.status = status;
    error.message = err;
    return error;
}

const testID = async(id, Model)=>{
    let error;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        error = "Invalid user ID !";
        return  error;
    }
    const user = await User.findById(id);
    if(!user){
        return error = "User Not Found !";
    }
    return "Noting wrong";
}

export {ErrorCreator, testID};