const express=require('express')
const router=express.Router()

const UserRoomController=require('../controller/UserRoomController')

router.post('/userjoinroom',UserRoomController.userjoinroom);
router.post('/leaveroom',UserRoomController.leaveroom);
router.post('/leaveall',UserRoomController.leaveall);
router.get('/conuser',UserRoomController.conuser);
router.post('/addpoints',UserRoomController.addpoints);
router.post('/notguessed',UserRoomController.notguessed);
router.post('/guessedusers',UserRoomController.guessedusers);
router.post('/getrank',UserRoomController.getrank);
router.post('/showrank',UserRoomController.showrank);

module.exports=router