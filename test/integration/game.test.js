const request = require('supertest');
const app = require('../../server');
const Game = require('../../model/Game');
const Word = require('../../model/Word');

describe('Integration testing for gamestatus route', () => {
    let roomId;
    let gameId;
    let words;
    let started;
    let round;
    let sound;

    beforeEach(async () => {
        // Generate random 10 letter string for roomId
        roomId = Math.random().toString(36).slice(2, 12);
    
        // Generate random 10 letter string for gameId
        gameId = Math.random().toString(36).slice(2, 12);
    
        words = [];
        while (words.length < 10) {
            let word = await Word.aggregate([{ $sample: { size: 1 } }]);
            if (!words.includes(word[0].word)) {
                words.push(word[0].word);
            }
        }
    
        started = 1;
        round = 0;
        sound = 0;
    
        await Game.create({ roomId, gameId, words, started, round, sound });
    });
    
    
    test('Should return 400 if roomId is not present in the request body', async () => {
        const res = await request(app)
            .post('/api/game/gamestatus')
            .send({});
    
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ message: 'roomId cannot be null' });
    });
    
    test('Should return 200 and game already started message if game with given roomId and started value of 1 already exists', async () => {
        const res = await request(app)
            .post('/api/game/gamestatus')
            .send({ roomId:'room123' });
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Game already started' });
    });
    
    test('Should return 200 and game created successfully message if game with given roomId and started value of 1 does not exist', async () => {
        roomId = Math.random().toString(36).slice(2, 12);
    
        const res = await request(app)
            .post('/api/game/gamestatus')
            .send({ roomId:'room123' });
    
        expect(res.statusCode).toBe(200);
       
    });
});    


describe("Gamestop", () => {
    let existingGame;

    beforeEach(async () => {
        existingGame = new Game({ roomId: "123", started: 1 });
        await existingGame.save();
    });
    
    test("should stop existing game and return success message", async () => {
        const res = await request(app)
            .post("/api/game/gamestop")
            .send({ roomId: existingGame.roomId });
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Game stopped successfully");
    
        const updatedGame = await Game.findOne({ roomId: existingGame.roomId });
        expect(updatedGame.started).toBe(0);
    });
    
    test("should return error message if game does not exist", async () => {
        const res = await request(app)
            .post("/api/game/gamestop")
            .send({ roomId: "notExist" });
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Game does not exist");
    });
    

});    

describe('Show Round Integration Test', () => {
    it('should return the round number and current word for an ongoing game', async () => {
    const game = new Game({
    roomId: 'abc123',
    started: 1,
    round: 2,
    currentWord: 'test'
    });
    await game.save();
    const res = await request(app)
    .post('/api/game/showround')
    .send({ roomId: 'abc123' });

expect(res.statusCode).toEqual(200);
expect(res.body).toEqual({ round: 2, currentWord: 'test' });
});


it('should return a 500 status code if an error occurs', async () => {
const game = new Game({
    roomId: 'abc123',
    started: 1,
    round: 2,
    currentWord: 'test'
});
await game.save();

// Mocking a database error
Game.findOne = jest.fn().mockImplementationOnce(() => {
    throw new Error();
});

const res = await request(app)
    .post('/api/game/showround')
    .send({ roomId: 'abc123' });

expect(res.statusCode).toEqual(500);
expect(res.body).toEqual({ message: "An error occurred" });
});
});


describe('Show round user integration test', () => {
    it('should return 404 if no ongoing game is found for the room', async () => {
    const res = await request(app)
    .post('/api/game/showrounduser')
    .send({ roomId: '123457886ygrgg', started: 1 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'No ongoing game found for this room' });
});

it('should return the round user if an ongoing game is found for the room', async () => {
const game = new Game({ roomId: '12345', started: 1, roundUser: 'player1' });
await game.save();

const res = await request(app)
  .post('/api/game/showrounduser')
  .send({ roomId: '12345', started: 1 });

expect(res.statusCode).toBe(404);

});

it('should return 500 if an error occurs', async () => {
// Mock Game.findOne to throw an error
jest.spyOn(Game, 'findOne').mockImplementationOnce(() => {
throw new Error('Test error');
});

const res = await request(app)
  .post('/api/game/showrounduser')
  .send({ roomId: '12345', started: 1 });

expect(res.statusCode).toBe(500);
expect(res.body).toEqual({ message: 'An error occurred' });
});
});

