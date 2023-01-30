const Word=require('../../model/Word')
const Game=require('../../model/Game')
const request = require("supertest");
const app = require('../../server');


describe('gamestatus', () => {
  
    test('Should return 400 if roomId is not provided', async () => {
      const res = await request(app)
        .post('/api/game/gamestatus')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'roomId cannot be null' });
    });
    test('Should return 200 and "game created successfully" if roomId is provided and game does not exist', async () => {
      const res = await request(app)
        .post('/api/game/gamestatus')
        .send({ roomId: 'testRoomId15663' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'game created successfully' });
      const game = await Game.findOne({ roomId: 'testRoomId' });
      expect(game).not.toBeNull();
    });
    test('Should return 200 and "Game already started" if roomId is provided and game already exists', async () => {
      await new Game({ roomId: 'testRoomId', started: 1 }).save();
      const res = await request(app)
        .post('/api/game/gamestatus')
        .send({ roomId: 'testRoomId' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Game already started' });
      const game = await Game.findOne({ roomId: 'testRoomId' });
      expect(game).not.toBeNull();
    });
  });



describe("changerounduser", () => {
beforeEach(async () => {
await Game.create({ roomId: "t123", started: 1, roundUser: "player1" });
});


it("should change the round user of an ongoing game", async () => {
const res = await request(app)
.post("/api/game/changerounduser")
.send({ roomId: "t123", roundUser: "player2" });

expect(res.status).toBe(200);
expect(res.body.roundUser).toBe("player2");

const updatedGame = await Game.findOne({ roomId: "t123" });
expect(updatedGame.roundUser).toBe("player2");
});

it("should return 404 if no ongoing game is found for the given room", async () => {
const res = await request(app)
.post("/api/game/changerounduser")
.send({ roomId: "99459", roundUser: "player2" });


expect(res.status).toBe(404);
expect(res.body.message).toBe("No ongoing game found for this room");
});

it("should return 500 if an error occurs", async () => {
jest.spyOn(Game, "findOne").mockImplementationOnce(() => {
throw new Error("Testing error");
});

const res = await request(app)
  .post("/api/game/changerounduser")
  .send({ roomId: "t123", roundUser: "player2" });

expect(res.status).toBe(500);
expect(res.body.message).toBe("An error occurred");
});
});