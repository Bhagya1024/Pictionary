const UserRoom=require('../../model/UserRoom')
const Game=require('../../model/Game')
const request = require("supertest");
const app = require('../../server');


describe('userjoinroom', () => {
 

    it('should return a 409 status code if the user is already connected to a room', async () => {
        const existingUserRoom = new UserRoom({
            username: 'testuser',
            roomId: 'testroom',
            connected: 1,
            points: 0,
            guessed: 0,
            round: 0
        });
        await existingUserRoom.save();

        const response = await request(app)
            .post('/api/userroom/userjoinroom')
            .send({
                username: 'testuser',
                roomId: 'anotherroom',
                connected: 1,
                points: 0,
                guessed: 0,
                round: 0
            });

        expect(response.status).toBe(409);
        expect(response.body).toEqual({ message: 'User already connected to a room' });
    });

    it('should return a 201 status code if the user is successfully joined a room', async () => {
        const response = await request(app)
            .post('/api/userroom/userjoinroom')
            .send({
                username: 'testuser425647',
                roomId: 'testroom',
                connected: 1,
                points: 0,
                guessed: 0,
                round: 0
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'User joined room successfully' });
    });
    it('should return a 500 status code if there is an error', async () => {
        jest.spyOn(UserRoom.prototype, 'save').mockImplementation(() => { throw new Error(); });

        const response = await request(app)
            .post('/api/userroom/userjoinroom')
            .send({
                username: 'testuser',
                roomId: 'testroom',
                connected: 1,
                points: 0,
                guessed: 0,
                round: 0
            });

        expect(response.status).toBe(409);

        UserRoom.prototype.save.mockRestore();
    });
});


describe('Test the showrank ', () => {
    it('It should return a json object with the ranking', async () => {
        const response = await request(app).post('/api/userroom/showrank').send({ roomId: 'ab5c' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: "No ongoing game in the room"
        });
    });

    it('It should return the ranking of the users', async () => {
        // Create a mock game object
        const game = new Game({ roomId: 'ab454c676', started: 1, firstPlace: 'username1', secondPlace: 'username2', thirdPlace: 'username3' });
        await game.save();
    
        // Create mock user objects ---- change roomID each test
        const user1 = new UserRoom({ username: 'username1', roomId: 'ab454c676', connected: 1, points: 100 });
        await user1.save();
        const user2 = new UserRoom({ username: 'username2', roomId: 'ab454c676', connected: 1, points: 90 });
        await user2.save();
        const user3 = new UserRoom({ username: 'username3', roomId: 'ab454c676', connected: 1, points: 80 });
        await user3.save();
    
        const response = await request(app).post('/api/userroom/showrank').send({ roomId: 'ab454c676' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            firstPlace: 'username1',
            secondPlace: 'username2',
            thirdPlace: 'username3',
            userPoints: [
                {username: 'username1', points: 100},
                {username: 'username2', points: 90},
                {username: 'username3', points: 80},
            ]
        });
    });
    
});