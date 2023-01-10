const express=require('express')
const router=express.Router()

const RoomController=require('../controller/RoomController')

router.post('/joinroom',RoomController.joinRoom);
router.post('/createroom',RoomController.createRoom);



module.exports=router