const mongoose = require('mongoose')

const Schema=mongoose.Schema

const gameSchema=new Schema({
    gameId:{
        type:String
    },
    roomId:{
        type:String
    },
    currentWord:{
        type:String
    },
    started:{
        type:Number
    },
    round:{
        type:Number
    },
    words:{
        type:[String]
    }
    
},{timestamps:true})

const Game=mongoose.model('Game',gameSchema)
module.exports=Game