const { response } = require('express')
const UserRoom=require('../model/UserRoom')
const Game=require('../model/Game')
const router = require('express').Router();

const userjoinroom = async (req, res) => {
    try {
        // check if a record with the entered username and connected value of 1 already exists
        const existingUserRoom = await UserRoom.findOne({ 
            username: req.body.username,
            connected: 1 
        });
        if (existingUserRoom) {
            return res.status(409).json({ message: "User already connected to a room" });
        }
        // If a record does not exist, create and save a new userRoom
        let userRoom = new UserRoom({
            username: req.body.username,
            roomId: req.body.roomId,
            connected: req.body.connected,
            points:req.body.points,
            guessed:0,
            round:0
        });
        await userRoom.save();
        return res.status(201).json({ message: "User joined room successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
};

const leaveroom = async (req, res) => {
    try {
        // check if a record with the entered username, roomId, and connected value of 1 exists
        const userRoom = await UserRoom.findOne({ 
            username: req.body.username,
            roomId: req.body.roomId,
            connected: 1 
        });
        if (!userRoom) {
            return res.status(404).json({ message: "User not found in room" });
        }
        // update the connected value to 0
        userRoom.connected = 0;
        await userRoom.save();
        return res.status(200).json({ message: "User left room successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
};

const leaveall = async (req, res) => {
    try {
        // check if a record with the entered username, roomId, and connected value of 1 exists
        const userRoom = await UserRoom.findOne({ 
            username: req.body.username,
            connected: 1 
        });
        if (!userRoom) {
            return res.send({ message: "User not found in room" });
        }
        // update the connected value to 0
        userRoom.connected = 0;
        await userRoom.save();
        return res.send({ message: "User left room successfully" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
};

const conuser = (req, res) => {

    const roomId = req.query.roomId;
    const connected = req.query.connected;

    UserRoom.find({ 
        roomId: roomId, 
        connected: connected 
    }, (err, users) => {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });

 };

 const addpoints = async (req, res) => {
    try {
    // Find a user with the passed parameters and connected being 1
    const user = await UserRoom.findOne({
    username: req.body.username,
    roomId: req.body.roomId,
    connected: 1});
    if (user) {
    // Check if the user has not guessed the word yet
    if(user.guessed === 0){
    // Increment the user's points by 100
    user.points += 100;
    user.round=req.body.round;
    user.guessed=1;
    // Save the updated user to the database
    await user.save();
    return { message: 'Points added successfully' };
    } else
     {
    return { message: 'User already guessed the word' };
    }
    } else
     {
    return { message: 'User not found or not connected' };
    }
    } catch (error) {
    console.log(error);
    return { message: 'Error adding points' };
    }
    };

    const notguessed = async (req, res) => {
        try {
        // Find users with the passed parameters and connected being 1
        const users = await UserRoom.updateMany(
        {
        username: req.body.username,
        roomId: req.body.roomId,
        connected: 1
        },
        {$set: {guessed: 0}}
        );
        if (users.nModified > 0) {
        return { message: 'not guessed updated successfully' };
        } else {
        return { message: 'Users not found or not connected' };
        }
        } catch (error) {
        console.log(error);
        return { message: 'Error updating not guessed status' };
        }
        };

const guessedusers = async (req, res) => {
try {
const roomId = req.body.roomId;
const round = req.body.round;

    // Find all users with the passed roomId and connected value of 1
    const connectedUsers = await UserRoom.find({ 
        roomId: roomId, 
        connected: 1 
    });
    if (!connectedUsers) {
        return res.status(404).json({ message: "No connected users found in room" });
    }
    // Filter the connected users to find those who have guessed the word in the passed round
    const guessedUsers = connectedUsers.filter(user => user.round === round && user.guessed === 1);
    // Extract the usernames of the guessed users
    const usernames = guessedUsers.map(user => user.username);
    return res.status(200).json({ usernames });
} catch (error) {
    return res.status(500).json({ message: "An error occurred" });
}
};

const getrank = async(req, res) => {
    const roomId = req.body.roomId;

    // Find connected users in the room
    const connectedUsers = await UserRoom.find({ roomId: roomId, connected: 1 });

    // Sort the users by their points in descending order
    connectedUsers.sort((a, b) => b.points - a.points);

    // Get the first, second, and third place users
    const firstPlace = connectedUsers[0];
    const secondPlace = connectedUsers[1];
    const thirdPlace = connectedUsers[2] || null;

    // Update the Game collection with the first, second, and third place usernames
    const game = await Game.findOne({ roomId: roomId,started:1 });
    game.firstPlace = firstPlace.username;
    game.secondPlace = secondPlace.username;
    game.thirdPlace = thirdPlace ? thirdPlace.username : null;
    await game.save();

    res.json({
        firstPlace: firstPlace.username,
        secondPlace: secondPlace.username,
        thirdPlace: thirdPlace ? thirdPlace.username : null
    });
};

const showrank = async(req, res) => {
    const roomId = req.body.roomId;

    // Check if there is an ongoing game in the room
    const game = await Game.findOne({ roomId: roomId, started: 1 });

    if (!game) {
        return res.json({ message: "No ongoing game in the room" });
    }

    // Retrieve the first, second, and third place usernames
    const firstPlace = game.firstPlace;
    const secondPlace = game.secondPlace;
    const thirdPlace = game.thirdPlace;

    // Find connected users in the room
    const connectedUsers = await UserRoom.find({ roomId: roomId, connected: 1 });

    // Create an array to store the users' points
    const userPoints = [];

    // Retrieve the points of first place
    if(firstPlace){
    const user1 = await UserRoom.findOne({username: firstPlace, roomId:roomId, connected: 1 });
    userPoints.push({username: firstPlace, points: user1.points});
    }
    // Retrieve the points of second place
    if(secondPlace){
    const user2 = await UserRoom.findOne({username: secondPlace, roomId:roomId, connected: 1 });
    userPoints.push({username: secondPlace, points: user2.points});
    }
    // Retrieve the points of third place
    if(thirdPlace){
    const user3 = await UserRoom.findOne({username: thirdPlace, roomId:roomId, connected: 1 });
    userPoints.push({username: thirdPlace, points: user3.points});
    }

    res.json({
        firstPlace: firstPlace,
        secondPlace: secondPlace,
        thirdPlace: thirdPlace,
        userPoints: userPoints
    });
};

    
  module.exports={
    userjoinroom,leaveroom,leaveall,conuser,addpoints,notguessed,guessedusers,getrank,showrank
}
