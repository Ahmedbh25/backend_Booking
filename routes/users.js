import express from "express";
import {updateUser, deleteUser, getUser, getUsers} from "../controllers/usersController.js";
import { verifyAdmin, verifyUser } from "../utils/TokenVerification.js";
const router =  express.Router();

// get all users.
router.get("/", verifyAdmin, getUsers);

//get user by id.
router.get("/:userID", verifyUser, getUser);

// delete user.
router.delete("/:userID", verifyAdmin, deleteUser);

// update user.
router.put("/:userID", verifyUser, updateUser);

export default router;