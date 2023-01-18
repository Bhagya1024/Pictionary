const mongoose = require('mongoose')

const Schema=mongoose.Schema

const userRoomSchema=new Schema({
    username:{
        type:String
    },
    roomId:{
        type:String
    },
    connected:{
        type:Number
    },
    points:{
        type:Number
    },
    guessed:{
        type:Number
    },
    round:{
        type:Number
    }
},{timestamps:true})

const UserRoom=mongoose.model('UserRoom',userRoomSchema)
module.exports=UserRoom