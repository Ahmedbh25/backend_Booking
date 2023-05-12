import express from "express";
import {addRoom, getRoom, getRooms, deleteRoom, updateRoom, updateRoomAvailability, getSingleRooms, getAvailableDates} from "../controllers/roomsController.js";
const router = express.Router();

router.get("/:roomID", getRoom);
router.get("/all/:hotelID", getRooms);
router.get("/all/single_rooms/:hotelID/:roomID", getSingleRooms);
router.post("/hotels/:id/rooms", getAvailableDates);
router.post("/:hotelID", addRoom);
router.delete("/:roomID/:hotelID", deleteRoom);
router.put("/:roomID", updateRoom);
router.put("/availability/:id", updateRoomAvailability);


export default router;