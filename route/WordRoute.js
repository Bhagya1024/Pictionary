const express=require('express')
const router=express.Router()

const WordController=require('../controller/WordController')

router.post('/addword',WordController.addword);
router.get('/getwords',WordController.getwords);

module.exports=router