
const { response } = require('express')
const Room=require('../model/Room')


//join room
const joinRoom = async (req, res, next) => {
    try {
        const roomId = req.body.roomId;
        const room = await Room.findOne({ roomId:roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        else{
            return res.status(200).json({ message: "Successfully joined room" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
}

//join private room
const joinprivate = async (req, res, next) => {
    try {
        const roomId = req.body.roomId;
       
        const room = await Room.findOne({ roomId:roomId });
        if (!room) {
            return res.status(404).json({ message: "Invalid Room ID" });
            
        } else {
            return res.status(200).json({ message: "Room found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
}



//create room
const createRoom = async (req, res, next) => {
    try {
        // Generate a unique 8 letter room ID
        let roomId = generateRoomId();

        // Check if the room ID already exists
        let roomExists = await Room.findOne({ roomId });
        while (roomExists) {
            roomId = generateRoomId();
            roomExists = await Room.findOne({ roomId });
        }
       
        // Create the new room with the unique room ID
        const newRoom = new Room({ roomId, username:req.body.username,private: 1 });
        await newRoom.save();


        return res.status(201).json({ message: "Room created successfully", roomId: roomId });
    } catch (error) {
        return res.status(500).json({ message: "Error creating room",error });
    }
}

const generateRoomId = () => {
    let roomId = "";
    const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 8; i++) {
        roomId += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return roomId;
}

let usersInRoom = [];

const subscribeToRoomChanges = (req, res) => {
    res.send({usersInRoom});
}

const updateUsersInRoom = (req, res) => {
    usersInRoom = req.body.usersInRoom;
    res.send({message: 'Users in room updated'});
}


module.exports={
    joinRoom,createRoom,subscribeToRoomChanges,updateUsersInRoom,joinprivate
}
