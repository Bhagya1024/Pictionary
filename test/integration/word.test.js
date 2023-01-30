const request = require('supertest');
const app = require('../../server');
const Word = require('../../model/Word');

describe("Integration testing for addword function", () => {
    beforeEach(async () => {
    
    });
    
    it("should add a new word to the database", async () => {
    const res = await request(app)
    .post("/api/word/addword")
    .send({ word: "bottle" });
    
 
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Word added to the database");
    });
    
  
    });

    
    
    