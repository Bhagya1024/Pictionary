const express=require('express')
const router=express.Router()

const UserController=require('../controller/UserController')

router.get('/',UserController.index);
router.post('/search',UserController.search);
router.post('/adduser',UserController.adduser);
router.post('/login',UserController.login);
router.post('/update',UserController.update);
router.post('/find',UserController.find);


module.exports=router