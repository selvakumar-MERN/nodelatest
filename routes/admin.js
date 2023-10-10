const express= require('express')
const router =express.Router();
const admindata= require('../controllers/admin')

//create,update & delete hotel and room
router.post('/createhotel',admindata.createHotel)
router.post('/updatehotel/:id',admindata.updateHotel)

module.exports=router;