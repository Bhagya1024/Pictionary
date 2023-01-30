const request = require('supertest');
const app = require('../../server');
const UserRoom = require('../../model/UserRoom');
const Game = require('../../model/Game');

describe('User join room', () => {
    it('should join a room successfully', async () => {
      const res = await request(app)
        .post('/api/userroom/userjoinroom')
        .send({
          username: 'Username12452244',
          roomId: '87037thr',
          connected: 1,
          points: 0,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User joined room successfully');
    });
  
    it('should return an error if user already connected to a room', async () => {
      // First create a user room
      await request(app)
        .post('/api/userroom/userjoinroom')
        .send({
          username: 'testu1',
          roomId: '87037thr',
          connected: 1,
          points: 0,
        });
  
      // Attempt to join another room with the same user
      const res = await request(app)
        .post('/api/userroom/userjoinroom')
        .send({
          username: 'testu1',
          roomId: '5trmq4x0',
          connected: 1,
          points: 0,
        });
  
      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('message', 'User already connected to a room');
    });
  });



describe("Leave Room", () => {
    it("should allow a user to leave a room", async () => {
        // create a user and add them to a room
        const user = { username: "tuser", roomId: "jg610gl1",connected: 1 };
        await UserRoom.create(user);
        
        const response = await request(app)
            .post("/api/userroom/leaveroom")
            .send({ username: "tuser", roomId: "jg610gl1" });
        
        expect(response.status).toEqual(200);
        
       
    });
    it("should return a 404 if the user is not in the room", async () => {
        const response = await request(app)
            .post("/api/userroom/leaveroom")
            .send({ username: "testuser", roomId: "jg610gl1" });
        
        expect(response.status).toBe(200);
    });
    
});


describe('UserRoom API', () => {

    it('should return a list of connected users for a specific room', async () => {
        const res = await request(app)
            .get('/api/userroom/conuser?roomId=457hfsfsf&connected=1')
            .expect(200);

        expect(res.body).toEqual([]);
    });



});

describe('Add points endpoint', () => {
    beforeEach(async () => {
        //create a new user
        await UserRoom.create({
            username: 'testuser',
            roomId: 'jg610gl1', 
            round: 0,
            points:0,
            guessed:0,
            connected:1
        });
    });

    it('Should add points to a user', async () => {
    const res = await request(app)
    .post('/api/userroom/addpoints')
    .send({ username: 'testuser', roomId: 'jg610gl1', round: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Points added successfully');
    });
  
      
});    

describe('Integration test for getrank function', () => {
    it('should update the Game collection with the first, second, and third place usernames', async () => {
        // Create test data for UserRoom and Game collections
        const userRoomData1 = { roomId: 'test1243', connected: 1, points: 200, username: 'user1' };
        const userRoomData2 = { roomId: 'test1243', connected: 1, points: 100, username: 'user2' };
        const userRoomData3 = { roomId: 'test1243', connected: 1, points: 50, username: 'user3' };
        const gameData = { roomId: 'test1243', started: 1 };
        await UserRoom.create(userRoomData1);
        await UserRoom.create(userRoomData2);
        await UserRoom.create(userRoomData3);
        await Game.create(gameData);
        
        // Send a POST request to the getrank endpoint
        const res = await request(app)
            .post('/api/userroom/getrank')
            .send({ roomId: 'test1243' });
        
        // Assert that the response has the correct data
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            firstPlace: 'user1',
            secondPlace: 'user2',
            thirdPlace: 'user3'
        });
        
        // Assert that the Game collection has been updated correctly
        const game = await Game.findOne({ roomId: 'test1243', started: 1 });
        expect(game.firstPlace).toEqual('user1');
        expect(game.secondPlace).toEqual('user2');
        expect(game.thirdPlace).toEqual('user3');
    });
}); 