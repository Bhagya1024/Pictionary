const express=require('express')
const router=express.Router()

const RoomController=require('../controller/RoomController')

router.post('/joinroom',RoomController.joinRoom);
router.post('/createroom',RoomController.createRoom);
router.get('/subscribeToRoomChanges',RoomController.subscribeToRoomChanges);
router.post('/updateUsersInRoom',RoomController.updateUsersInRoom);
router.post('/joinprivate',RoomController.joinprivate);

module.exports=router