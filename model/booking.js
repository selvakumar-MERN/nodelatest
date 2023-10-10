const mongoose = require('mongoose');
const bookingSchema= new mongoose.Schema({
    hotelId:{
        type:String,
    },
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
})

module.exports = mongoose.model("bookingschema", bookingSchema);