const mongoose= require("mongoose");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        min:3,
    },
    name:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        min:6,
    },
   
    confirmPassword:{
        type:String,
        required:true,
        min:6,
    },
    role:{
        type:String,
        default:'user',
    },
    booking: [{
        bookingId: {
            type: String,
        },
        hotelName: {
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
module.exports= mongoose.model("userschema",userSchema);