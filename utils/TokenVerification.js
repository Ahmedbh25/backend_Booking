import jwt from "jsonwebtoken";
import { ErrorCreator } from "./FunctionError.js";

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(ErrorCreator("You are not authenticated!", 401));
    }
    jwt.verify(token, process.env.JWT_TOKEN, (error, user) => {
        if (error) return next(ErrorCreator("Invalid Token"));
        req.user = user;
        next();
    });
};

const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(ErrorCreator("You are not authorized!", 403));
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, ()=>{
        if(!req.user.isAdmin){
            return next(ErrorCreator("You are not authorized!", 403));
        }else{
            next(ErrorCreator(req.user.isAdmin, 403));
        }
        next(ErrorCreator("req.user.isAdmin", 403));
    })
};

export {verifyUser, verifyAdmin}