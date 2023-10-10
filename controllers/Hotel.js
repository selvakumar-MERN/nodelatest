const booking = require('../model/booking')
const hotel= require('../model/hotel')



const gethotel= async(req,res)=>{
    const{place}=req.params
    try{
         const find= await hotel.find({"place":place})
         res.status(200).send(find)
    
    }
    catch(error){
        res.status(400).send(error)
    }
}

const getone= async(req,res)=>{
    const{id}=req.params
    try{
         const find= await hotel.find({"_id":id})
         res.status(200).send(...find)
    
    }
    catch(error){
        res.status(400).send(error)
    }
}

const getdate= async(req,res)=>{
    const {id}= req.params
    const {startdate,enddate}=req.body
    console.log(enddate)
    try{
        console.log(startdate,enddate)
         const find= await booking.find({$and:[{hotelId:id,fromDate:{$gte: startdate},toDate:{$lte: enddate}}]})
         console.log(find)
    }
    catch(error){

    }
}



const gethotels= async(req,res)=>{
    
    try{
         const find= await hotel.find()
         res.status(200).send(find)
    
    }
    catch(error){
        res.status(400).send(error)
    }
}


module.exports.getdate=getdate;
module.exports.getone=getone;
module.exports.gethotel=gethotel;
module.exports.gethotels=gethotels;