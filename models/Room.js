import mongoose from "mongoose";
import { Schema } from "mongoose";
const RoomSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    maxPeople: {
        type: Number,
        required: true,
    },
    room_numbers : [{number:Number, unavailableDates : {type:[Date] }}],
},
    { timestamps: true }
);

export default mongoose.model("Room", RoomSchema)