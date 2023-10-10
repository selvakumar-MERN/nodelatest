const mongoose = require("mongoose");
const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    place: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    aminities: {
        type: Array,
    },
    totalRooms:{
        type:Number,
    },
    singleBed:{
        type:Number,
    },
    singlebedPrice:{
        type:Number,
    },
    doubleBed:{
        type:Number,
    },
    doublebedPrice:{
        type:Number,
    },
    room: [{
        roomId: {
            type: String,
        },
        type: {
            type: String,
        },
        price: {
            type: Number,
        }
    }],
    booking: [{
        bookingId: {
            type: String,
        },
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        roomId: {
            type: String,
        },
        type: {
            type: String,
        },
        price: {
            type: Number,
        },
        fromDate:{
            type:Date,
        },
        toDate:{
             type:Date,
        },
        bookedOn:{
            type:Date,
        }
    }]




})
module.exports = mongoose.model("hotelschema", hotelSchema);