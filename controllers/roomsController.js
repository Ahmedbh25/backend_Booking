import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

// ADD ROOM OF SPECIFIC HOTEL
const addRoom = async (req, res, next) => {
    const newRoom = new Room(req.body);
    try {
        const savedRoom = await newRoom.save();
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.hotelID)) {
                return res.status(404).json({ message: 'Invalid hotel ID' });
            }
            const hotel = await Hotel.findByIdAndUpdate(req.params.hotelID, { $push: { rooms: savedRoom._id } });
            if (!hotel) {
                res.status(404).json("Hotel Not Found");
            }
        } catch (error) {
            next(error);
        }
        res.status(200).json(savedRoom);
    } catch (error) {
        next(error);
    }
}

// GET ROOM BY ID
const getRoom = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.roomID)) {
            return res.status(404).json({ message: 'Invalid room ID' });
        }
        const room = await Room.findById(req.body.roomID);
        res.status(200).json(room);
    } catch (error) {
        next(error);
    }
}

// GET ALL ROOMS OF SPECIFIC HOTEL
const getRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelID);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const roomIds = hotel.rooms;
        const rooms = await Room.find({ _id: { $in: roomIds } });
        res.status(200).json({ rooms });
    } catch (error) {
        next(error);
    }
}

const getSingleRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelID);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const rooms = await Room.find({ _id: { $in: req.params.roomID } }).select('room_numbers');
        res.status(200).json({ rooms: rooms[0].room_numbers });
    } catch (error) {
        next(error);
    }
}

// DELETE ROOM OF SPECIFIC HOTEL
const deleteRoom = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.roomID)) {
            return res.status(404).json({ message: 'Invalid room ID' });
        } else if (!mongoose.Types.ObjectId.isValid(req.params.hotelID)) {
            return res.status(404).json({ message: 'Invalid hotel ID' });
        }

        try {
            const roomID = await Room.findOne({ _id: req.params.roomID });
            if (!roomID) {
                return res.status(404).json("Room ID is not match any room !")
            }
        } catch (error) {
            return (error);
        }

        try {
            const hotelID = await Hotel.findOne({ _id: req.params.hotelID });
            if (!hotelID) {
                return res.status(404).json("Hotel ID is not match any hotel !")
            }
        } catch (error) {
            return (error);
        }

        await Room.findByIdAndDelete(req.params.roomID);
        try {
            await Hotel.findByIdAndUpdate(req.params.hotelID, { $pull: { rooms: req.params.roomID } });
        } catch (error) {
            next(error);
        }
        res.status(200).json("Room has been deleted successfully");
    } catch (error) {
        next(error)
    }
};


// UPDATE ROOM OF SPECIFIC HOTEL
const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.roomID, { $set: req.body }, { new: true });
        res.status(200).json(updatedRoom);
    } catch (error) {
        next(error);
    }
}

// UPDATE ROOM AVAILABILITY :
const updateRoomAvailability = async (req, res, next) => {
    try {
        await Room.updateOne(
            { "room_numbers._id": req.params.id },
            {
                $push: {
                    "room_numbers.$.unavailableDates": req.body.dates
                },
            }
        );
        res.status(200).json("Room status has been updated.");
    } catch (error) {
        next(error);
    }
}

// show available dates for evry hotel Rooms:
const getAvailableDates = async (req, res, next) => {
    const data = req.body;
    try {
        const hotels = await Hotel.find({ city: { $regex: data.city, $options: 'i' } });
        if (!hotels.length) {
            res.status(404).json("hotels not found");
        }
        try {
            const availableRooms = [];
            const arrival_date = new Date(data.arrival);
            const departure_date = new Date(data.departure);
            for (const hotel of hotels) {
                const rooms = await Room.find({
                    "room_numbers": {
                        $elemMatch: {
                            "unavailableDates": {
                                $not: {
                                    $elemMatch: {
                                        $gte: arrival_date,
                                        $lte: departure_date
                                    }
                                }
                            },
                            "unavailableDates": {
                                $not: {
                                    $in: [arrival_date, departure_date]
                                }
                            }
                        }
                    }
                });
                /*

                const updatedRoomNumbers = [];
                for (const room of rooms) {
                    const updatedRoom = room.toObject();
                    updatedRoom.room_numbers = room.room_numbers.filter((roomNumber) => {
                        const isAvailable = roomNumber.unavailableDates.every((unavailableDate) => {
                            return unavailableDate < arrival_date || unavailableDate > departure_date ;
                        });
                        return isAvailable;
                    });
                    if (updatedRoom.room_numbers.length > 0) {
                        updatedRoomNumbers.push(updatedRoom);
                    }
                }
                if (updatedRoomNumbers.length > 0) {
                    availableRooms.push({ ...updatedRoomNumbers, hotel_name: hotel.name, city: hotel.city });
                }*/
                res.status(200).json(rooms);
            }
            
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

export { addRoom, getRoom, getRooms, deleteRoom, updateRoom, updateRoomAvailability, getSingleRooms, getAvailableDates };