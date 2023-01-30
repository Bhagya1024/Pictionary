const request = require('supertest');
const app = require('../../server');
const Room = require('../../model/Room');

describe('Create Room', () => {
it('should create a new room', async () => {
const res = await request(app)
.post('/api/room/createroom')
.send({ username: 'testuser' });
expect(res.status).toEqual(201);
expect(res.body).toEqual({ message: 'Room created successfully', roomId: expect.any(String) });
expect(res.body).toHaveProperty('roomId');

// check that the room was actually created in the database
const room = await Room.findOne({ roomId: res.body.roomId });
expect(room).toBeDefined();
expect(room.username).toEqual('testuser');
});
});

describe("joinRoom", () => {
    let room;
    beforeEach(async () => {
   
    });
    it("should return a 200 status and a message of 'Successfully joined room' if the room is found", async () => {
        const response = await request(app)
            .post("/api/room/joinroom")
            .send({ roomId: "5224l8nx" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Successfully joined room");
    });
    
    it("should return a 404 status and a message of 'Room not found' if the room is not found", async () => {
        const response = await request(app)
            .post("/api/room/joinroom")
            .send({ roomId: "4227l8nx" });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Room not found");
    });
    
    it("should return a 500 status and a message of 'An error occurred' if there is a server error", async () => {
        jest.spyOn(Room, "findOne").mockImplementation(() => {
            throw new Error();
        });
        const response = await request(app)
            .post("/api/room/joinroom")
            .send({ roomId: "5224l8nx" });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("An error occurred");
    });
});



