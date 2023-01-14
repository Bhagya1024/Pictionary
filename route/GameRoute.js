const express=require('express')
const router=express.Router()

const GameController=require('../controller/GameController')

router.post('/gamestatus',GameController.gamestatus);
router.post('/gamestop',GameController.gamestop);
router.post('/gameword',GameController.gameword);
router.post('/updateround',GameController.updateround);
router.post('/showround',GameController.showround);

module.exports=router