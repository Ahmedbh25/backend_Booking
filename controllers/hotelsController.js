import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// ADD HOTEL
const addHotel = async (req, res, next) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(200).json(newHotel);
    } catch (error) {
        next(error);
    }
}

// GET HOTEL BY NAME : 

const getHotelByName = async (req, res, next) => {
    const hotelName = req.body.name;
    try {
        const hotel = await Hotel.find({ name: { $regex: hotelName.trim(), $options: "i" } } );
        if (!hotel) {
            res.status(404).json("Hotel not found !");
        }
        res.status(200).json(hotel);
    } catch (error) {
        next(error);
    }
}

// GET HOTEL BY ID
const getHotel = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.hotelID)) {
            return res.status(404).json({ message: 'Invalid hotel ID' });
        }
        const hotel = await Hotel.findById(req.params.hotelID);
        if (!hotel) {
            return res.status(404).json({ msg: "hotel not found", hotel })
        }
        res.status(200).json(hotel);
    } catch (error) {
        next(error);
    }
}

// GET ALL HOTELS
const getHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
        const hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gt: min | 1, $lt: max || 999 },
        }).limit(req.query.limit);
        if (!hotels) {
            res.status(400).json({ msg: "empty list of hotels", hotels });
        }
        res.status(200).json(hotels);
    } catch (error) {
        next(error);
    }
}

// DELETE HOTEL
const deleteHotel = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.hotelID)) {
            return res.status(404).json({ message: 'Invalid hotel ID' });
        }
        await Hotel.findByIdAndDelete(req.params.hotelID);
        res.status(200).json("Hotel Deleted Successfully");
    } catch (error) {
        next(error);
    }
}

// UPDATE HOTEL
const updateHotel = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.hotelID)) {
            return res.status(404).json({ message: 'Invalid hotel ID' });
        }
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.hotelID, { $set: req.body }, { new: true });
        res.status(200).json(updatedHotel);
    } catch (error) {
        next(error);
    }
}

// SHOW LIST OF CITIES BY NUMBER OF HOTELS INSIDE EVRY CITY.
const getHotelsCities = async (req, res, next) => {
    try {
        const cities = await Hotel.distinct('city');
        if (!cities) {
            return res.status(404).json("cities not found");
        }
        try {
            //Promise.all() static method takes an iterable of promises as input and returns a single Promise.
            const citiesList = await Promise.all(
                cities.map((city) => {
                    return Hotel.countDocuments({ city: city });
                })
            )
            res.status(200).json({ citiesList, cities });
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

const getByCityName = async (req, res, next) => {
    try {
        const city = req.params.city_name.toLowerCase();
        const hotels = await Hotel.find({ city: { $regex: city, $options: 'i' } });
        if (!hotels) {
            res.status(404).json("no hotels mutch this city");
        }
        res.status(200).json(hotels);
    } catch (error) {
        next(error);
    }
}

const updateHotelRating = async (req, res, next) => {
    const hotelID = req.params.hotel_id;
    const userID = req.params.user_id;
    //return res.status(404).json({hotelID, userID});
    try {
        const hotel = await Hotel.findById(hotelID);
        if (!hotel) {
            return res.status(404).json("hotel not found");
        }
        try {
            const userRatings = await User.findById(userID, "ratings");
            if (userRatings.ratings.includes(hotelID)) {
                return res.status(400).json("you have already rated this hotel !");
            }
        } catch (error) {
            next(error);
        }

        if (!(req.body.rating > 0 && req.body.rating < 6)) {
            return res.status(404).json("rating must be between 1 and 5");
        }

        if (hotel.rating.number) {
            hotel.rating.number = ((hotel.rating.number * hotel.rating.total_ratings) + req.body.rating) / (hotel.rating.total_ratings + 1);
        } else {
            hotel.rating.number = req.body.rating;
        }

        if (hotel.rating.total_ratings) {
            hotel.rating.total_ratings += 1;
        } else {
            hotel.rating.total_ratings = 1;
        }

        const updatedHotel = await hotel.save();
        await User.findByIdAndUpdate(userID, { $push: { ratings: updatedHotel._id } });
        res.status(200).json(updatedHotel);
    } catch (error) {
        next(error);
    }
}

export { addHotel, getHotel, getHotels, deleteHotel, updateHotel, getHotelsCities, getByCityName, updateHotelRating, getHotelByName };

/*
The reason why citiesList and cities arrays are in the same order is because the Promise.all()
 method preserves the order of the promises that are passed to it. In this case, the promises 
 are created using the cities.map() method, which preserves the order of the cities array.

So when the promises are resolved by the Promise.all() method, the resulting array of counts will 
have the same order as the cities array. This means that the citiesList and cities arrays will be
 in the same order, with the count for each city corresponding to the same index in both arrays.

That's why in the response, you see the citiesList and cities arrays in the same order. The count 
for "Hammamet" is first in the citiesList array because "Hammamet" is first in the cities array.
Similarly, the count for "Monastir" is second in the citiesList array because "Monastir" is second
in the cities array, and so on.
*/