const { response } = require('express')
const Game=require('../model/Game')
const Word = require('../model/Word')
const UserRoom = require('../model/UserRoom')

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
          
          return res.status(200).json({ message: "Game already started" });
        }
        else
        {
         
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
              round:0,
              sound:0
          });
    
 
          await newGame.save();

          // console.log(newGame);
          return res.status(200).json({ message: "game created successfully" });
        }
       
        
        } catch (error) {
        return res.status(500).json({ error });
        
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

// const updateround = async (req, res) => {
//     try {
//       // Check if a game with the passed roomId and started value of 1 exists
//       const existingGame = await Game.findOne({ 
//         roomId: req.body.roomId,
//         started: 1 
//       });
//       if (!existingGame) {
//         return res.status(404).json({ message: "No ongoing game found for this room" });
//       }
//       // Update the round number for the existing game
//       existingGame.round = req.body.round;
//       existingGame.currentWord = req.body.currentWord;
//       await existingGame.save();
//       return res.status(200).json({ message: "Round number updated successfully" });
//     } catch (error) {
//       return res.status(500).json({ message: "An error occurred" });
//     }
//   }
  

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
  

  const updatetime = async (req, res) => {
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
      existingGame.time = req.body.time;
      await existingGame.save();
      return res.status(200).json({ message: "time updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred" });
    }
  }
  
  const showtime = async (req, res) => {
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
        return res.status(200).json({ time: existingGame.time});
       
      } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
      }
  }

  // const changerounduser = async (req, res) => {
  //   try {
  //       // Check if a game with the passed roomId and started value of 1 exists
  //       const existingGame = await Game.findOne({ 
  //         roomId: req.body.roomId,
  //         started: 1 
  //       });
  //       if (!existingGame) {
  //         return res.status(404).json({ message: "No ongoing game found for this room" });
  //       }
  //       existingGame.roundUser = req.body.roundUser;
  //       await existingGame.save();
  //       return res.status(200).json({ message: "round user updated"});
       
  //     } catch (error) {
  //       return res.status(500).json({ message: "An error occurred" });
  //     }
  // }

  const changerounduser = async (req, res) => {
    try {
        // Check if a game with the passed roomId and started value of 1 exists
        const existingGame = await Game.findOne({ 
          roomId: req.body.roomId,
          started: 1 
        });
        if (!existingGame) {
          return res.status(404).json({ message: "No ongoing game found for this room" });
        }
        existingGame.roundUser = req.body.roundUser;
        await existingGame.save();
        return res.status(200).json({ roundUser: existingGame.roundUser});
       
      } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
      }
  }


  const showrounduser = async (req, res) => {
    try {
        // Check if a game with the passed roomId and started value of 1 exists
        const existingGame = await Game.findOne({ 
          roomId: req.body.roomId,
          started: 1 
        });
        if (!existingGame) {
          return res.status(404).json({ message: "No ongoing game found for this room" });
        }
     
        return res.status(200).json({ roundUser: existingGame.roundUser});
       
      } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
      }
  }

  const updatesound = async (req, res) => {
    try {
        // Check if a game with the passed roomId and started value of 1 exists
        const existingGame = await Game.findOne({ 
          roomId: req.body.roomId,
          started: 1 
        });
        if (!existingGame) {
          return res.status(404).json({ message: "No ongoing game found for this room" });
        }
        if(existingGame.sound===0){
          existingGame.sound=1;
          await existingGame.save();
          return res.status(200).json({ message: "sound playing" });
        }
        else{
          return res.status(200).json({ message: "sound played" });
        }
      } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
      }
  }

  
  const updatesoundzero = async (req, res) => {
    try {
        // Check if a game with the passed roomId and started value of 1 exists
        const existingGame = await Game.findOne({ 
          roomId: req.body.roomId,
          started: 1 
        });
        if (!existingGame) {
          return res.status(404).json({ message: "No ongoing game found for this room" });
        }
       
          existingGame.sound=0;
          await existingGame.save();
          return res.status(200).json({ message: "sound zero" });
       
      } catch (error) {
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
        // Update the round number, currentWord and set sound and guessed to 0 for the existing game
        existingGame.round = req.body.round;
        existingGame.currentWord = req.body.currentWord;
        existingGame.sound=0;
        // update the guessed value of all players to 0
        const connectedUsers = await UserRoom.find({roomId: req.body.roomId, connected: 1});
        for (const user of connectedUsers) {
            user.guessed = 0;
            await user.save();
        }
        await existingGame.save();
        return res.status(200).json({ message: "Round number updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
};


const updateroundend = async (req, res) => {
  try {
      // Check if a game with the passed roomId and started value of 1 exists
      const existingGame = await Game.findOne({ 
          roomId: req.body.roomId,
          started: 1 
      });
      if (!existingGame) {
          return res.status(404).json({ message: "No ongoing game found for this room" });
      }
      // Update the round number
      existingGame.round = 11;     
      await existingGame.save();
      return res.status(200).json({ message: "Round number updated successfully" });
  } catch (error) {
      return res.status(500).json({ message: "An error occurred" });
  }
};







module.exports={
    gamestatus,gamestop,gameword,updateround,showround,updatetime,showtime,changerounduser,showrounduser,updatesound,updatesoundzero,updateroundend
}
