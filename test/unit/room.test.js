const Room=require('../../model/Room')
const request = require("supertest");
const app = require('../../server');


describe('joinRoom', () => {
    it('should return a 200 status and success message if the room is found', async () => {
    const mockRoom = { roomId: '123' };
    jest.spyOn(Room, 'findOne').mockResolvedValue(mockRoom);
   
    const res = await request(app)
      .post('/api/room/joinroom')
      .send({ roomId: '123' });
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Successfully joined room' });
    });
    
    it('should return a 404 status and error message if the room is not found', async () => {
    jest.spyOn(Room, 'findOne').mockResolvedValue(null);
  
    const res = await request(app)
      .post('/api/room/joinroom')
      .send({ roomId: '456' });
    
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Room not found' });
    });
    
    it('should return a 500 status and error message if an error occurs', async () => {
    jest.spyOn(Room, 'findOne').mockRejectedValue(new Error());
    

    const res = await request(app)
      .post('/api/room/joinroom')
      .send({ roomId: '789' });
    
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'An error occurred' });
    });
    });
