const hotel= require('../model/hotel')

const createHotel = async(req,res)=>{
    console.log(req.body.data.name)
    const create = new hotel({
        name:req.body.data.name,
        place:req.body.data.place,
        image:req.body.data.image,
        description:req.body.data.description,
        totalRooms:req.body.data.totalRooms,
        singleBed:req.body.data.singleBed,
        singlebedPrice: req.body.data.singlebedPrice,
        doubleBed:req.body.data.doubleBed,
        doublebedPrice: req.body.data.doublebedPrice,
        aminities:req.body.checkboxaminities
    })
    try{
      const save=  await create.save();
      if(save){
        const find= await hotel.findOne({'_id':create._id})
       const singlebed= Array(find.singleBed).fill().map(async(_,i)=>
               await hotel.updateOne({"_id":create._id},{$push:{"room":{"roomId":`S${i+1}`,"type":'Single Bed',"price":300}}})
       )
      const doublebed= Array(find.doubleBed).fill().map(async(_,i)=>
       await hotel.updateOne({"_id":create._id},{$push:{"room":{"roomId":`B${i+1}`,"type":'Double Bed',"price":500}}})
)
      }
   
             
          
        res.status(200).send(create)
    }
    catch(error){
        res.status(400).send(error)
    }
}

const updateHotel= async(req,res)=>{
   
    try{
        const update=   await hotel.updateOne({_id:req.params.id},{$set:{ "name":req.body.item.name, "place":req.body.item.place,"image":req.body.item.image,
           "description":req.body.item.description,
           "totalRooms":req.body.item.totalRooms,
           "singleBed":req.body.item.singleBed,
           "singlebedPrice": req.body.item.singlebedPrice,
           "doubleBed":req.body.item.doubleBed,
           "doublebedPrice": req.body.item.doublebedPrice,
           "aminities":req.body.checkboxaminities}})  
          if(update) {
          const emptyroom= await hotel.updateOne({_id:req.params.id},{$set:{"room":[]}},{multi:true});
              
           const singlebed= Array(Number(req.body.item.singleBed)).fill().map(async(_,i)=>
                    await hotel.updateOne({"_id":req.params.id},{$push:{"room":{"roomId":`S${i+1}`,"type":'Single Bed',"price":300}}})
            )
           const doublebed= Array(Number(req.body.item.doubleBed)).fill().map(async(_,i)=>
            await hotel.updateOne({"_id":req.params.id},{$push:{"room":{"roomId":`B${i+1}`,"type":'Double Bed',"price":500}}})
     )
           
          }
          res.status(200).send("update sucessfull")
          
    }
    catch(error){
        res.status(400).send(error)
    }
}


module.exports.updateHotel=updateHotel; 
module.exports.createHotel= createHotel;