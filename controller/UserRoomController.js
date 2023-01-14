const { response } = require('express')
const UserRoom=require('../model/UserRoom')
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
            points:req.body.points
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
    



    
  module.exports={
    userjoinroom,leaveroom,leaveall,conuser
}
