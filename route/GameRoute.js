const express=require('express')
const router=express.Router()

const GameController=require('../controller/GameController')

router.post('/gamestatus',GameController.gamestatus);
router.post('/gamestop',GameController.gamestop);
router.post('/gameword',GameController.gameword);
router.post('/updateround',GameController.updateround);
router.post('/showround',GameController.showround);
router.post('/updatetime',GameController.updatetime);
router.post('/showtime',GameController.showtime);
router.post('/changerounduser',GameController.changerounduser);
router.post('/showrounduser',GameController.showrounduser);
router.post('/updatesound',GameController.updatesound);
router.post('/updatesoundzero',GameController.updatesoundzero);
router.post('/updateroundend',GameController.updateroundend);

module.exports=router