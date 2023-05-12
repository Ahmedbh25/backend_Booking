import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const HotelSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    rooms: {
        type: [String],
    },
    distance: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    rating: {number : {
        type: Number,
        min: 0,
    }, total_ratings : {
        type: Number,
    }},
    
    cheapestPrice: {
        type: Number,
        required: true,
      },
    featured: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Hotel", HotelSchema)