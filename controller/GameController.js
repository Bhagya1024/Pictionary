const { response } = require('express')
const Game=require('../model/Game')
const Word = require('../model/Word')

const gamestatus = async (req,res)=>{
    try {
        // check if the roomId field is null
        if (!req.body.roomId) {
            return res.status(400).json({ message: "roomId cannot be null" });
        }
        // check if a record with the entered roomId and connected value of 1 already exists
        const existingGame = await Game.findOne({ 
            roomId: req.body.roomId,
            started: 1 
        });
        if (existingGame) {
            return res.json({ message: "Game already started" });
        }
        // Generate random 10 letter string for gameId
        let gameId = Math.random().toString(36).slice(2, 12);
        let words =[]
        while(words.length<10){
            let word = await Word.aggregate([{$sample: {size: 1}}]);
            if(!words.includes(word[0].word))
            words.push(word[0].word)
        }
        // If a record does not exist, create and save a new game
        let newGame = new Game({
            roomId: req.body.roomId,
            gameId: gameId,
            words: words,
            started: 1,
            round:0
        });
        await newGame.save();
        return res.status(201).json({ message: "game created successfully" });
        } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
        }
 }


const gamestop = async (req, res) => {
    try {
        const existingGame = await Game.findOne({ 
            roomId: req.body.roomId,
            started: 1 
        });
        if (!existingGame) {
            return res.json({ message: "Game does not exist" });
        }
        existingGame.started = 0;
        await existingGame.save();
        return res.status(200).json({ message: "Game stopped successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
}

const gameword = async (req, res) => {
    try {
        const game = await Game.findOne({
            roomId: req.body.roomId,
            started: 1
        });
        if (!game) {
            return res.status(404).json({ message: "No game found with the specified roomId and started value" });
        }
        return res.status(200).json({ words: game.words });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
}

const updateround = async (req, res) => {
    try {
      // Check if a game with the passed roomId and started value of 1 exists
      const existingGame = await Game.findOne({ 
        roomId: req.body.roomId,
        started: 1 
      });
      if (!existingGame) {
        return res.status(404).json({ message: "No ongoing game found for this room" });
      }
      // Update the round number for the existing game
      existingGame.round = req.body.round;
      existingGame.currentWord = req.body.currentWord;
      await existingGame.save();
      return res.status(200).json({ message: "Round number updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred" });
    }
  }
  

  const showround = async (req, res) => {
    try {
        // Check if a game with the passed roomId and started value of 1 exists
        const existingGame = await Game.findOne({ 
          roomId: req.body.roomId,
          started: 1 
        });
        if (!existingGame) {
          return res.status(404).json({ message: "No ongoing game found for this room" });
        }
        // show the round number for the existing game
        return res.status(200).json({ round: existingGame.round, currentWord: existingGame.currentWord });
       
      } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
      }
  }
  






module.exports={
    gamestatus,gamestop,gameword,updateround,showround
}
