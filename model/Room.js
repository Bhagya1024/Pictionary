const mongoose = require('mongoose')

const Schema=mongoose.Schema

const roomSchema=new Schema({
    roomId:{
        type:String,
        required: true,
        unique: true
    },
    username:{
        type:String
    },
    private:{
        type:Number
    },
},{timestamps:true})

const Room=mongoose.model('Room',roomSchema)
module.exports=Room