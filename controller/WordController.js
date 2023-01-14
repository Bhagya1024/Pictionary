const { response } = require('express')
const Word=require('../model/Word')
const router = require('express').Router();


// Add a route to add a new word to the database
const addword= (req, res) => {
    const newWord = new Word({
      word: req.body.word
    });
    newWord.save((error) => {
      if (error) {
        res.send(error);
      } else {
        res.send('Word added to the database');
      }
    });
  };



const getwords= async (req, res) => {
  try {
    // Get the count of words in the database
    const count = await Word.count();
    // Create an array to store the random and unique words
    const words = [];
    // Set a counter to 0
    let counter = 0;
    // Run a loop until we have 10 unique words
    while (counter < 10) {
      // Generate a random number between 0 and the count of words in the database
      const random = Math.floor(Math.random() * count);
      // Find a word at the random index
      const result = await Word.findOne().skip(random).exec();
      // Check if the word is already in the array
      if (!words.includes(result.word)) {
        // If not, add it to the array
        words.push(result.word);
        // Increment the counter
        counter++;
      }
    }
    // Send the array of unique words as a response
    res.send({ words });
  } catch (error) {
    res.send(error);
  }
};




  
  module.exports={
    addword,getwords
}
