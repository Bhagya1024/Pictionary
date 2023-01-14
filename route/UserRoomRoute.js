const express=require('express')
const router=express.Router()

const UserRoomController=require('../controller/UserRoomController')

router.post('/userjoinroom',UserRoomController.userjoinroom);
router.post('/leaveroom',UserRoomController.leaveroom);
router.post('/leaveall',UserRoomController.leaveall);
router.get('/conuser',UserRoomController.conuser);

module.exports=router