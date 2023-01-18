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
    },
    roundUser:{
        type:String
    },
    time:{
        type:Number
    },
    sound:{
        type:Number
    },
    firstPlace:{
        type:String
    },
    secondPlace:{
        type:String
    },
    thirdPlace:{
        type:String
    }
    
},{timestamps:true})

const Game=mongoose.model('Game',gameSchema)
module.exports=Game