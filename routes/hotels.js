import express from "express";
import {addHotel, getHotel, getHotels, deleteHotel, updateHotel, getHotelsCities, getByCityName, updateHotelRating, getHotelByName} from "../controllers/hotelsController.js";
import { verifyAdmin, verifyUser } from "../utils/TokenVerification.js";
const router = express.Router();

router.get("/cities", getHotelsCities);
router.get("/:hotelID", getHotel);
router.get("/", getHotels);
router.get("/city/:city_name", getByCityName);
router.get("/by_name/:city_name", getByCityName);

router.post("/",verifyAdmin, addHotel);
router.post("/by_name", verifyUser, getHotelByName);

router.delete("/:hotelID",verifyAdmin ,deleteHotel);

router.put("/:hotelID",verifyAdmin ,updateHotel);
router.put("/update_hotel/:hotel_id/:user_id", verifyUser , updateHotelRating);

export default router;
