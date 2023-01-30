
const User = require('../../model/User');
const { describe, it } = require("@jest/globals");
const request = require("supertest");
const app = require('../../server');

describe("POST /user login", () => {
  it("user login", async () => {
    await request(app)
      .post('/api/user/login')
      .send({username:"geeth2", password: "12345678"})
      .set("Accept", "application/json")
      .expect(200);
  });
});

describe("POST /user reg", () => {
  it("user Reg", function (done) {
    request(app)
      .post("/api/user/adduser")
      .send({email:"geethan2@gmail.com", username:"geeth2", password: "12345678"})
      .set("Accept", "application/json")
      .expect(200)
      .end(function (err, res) {
        if (err) {return done(err);}
        return done();
      });
  });
});


describe('Search function', () => {
    beforeEach(async () => {
        //create a new user
        await User.create({
            username: 'Bhagya'
        });
    });

    it('should return exists: 1 when the user exists', async () => {
        // send a POST request to the search endpoint with the username as the body
        const res = await request(app)
            .post('/api/user/search')
            .send({ username: 'testuser' });

        // expect the response to have a status of 200 and the JSON body to have exists: 1
        expect(res.status).toBe(200);
        expect(res.body.exists).toBe(1);
    });

    it('should return exists: 0 when the user does not exist', async () => {
        // send a POST request to the search endpoint with a non-existent username as the body
        const res = await request(app)
            .post('/api/user/search')
            .send({ username: 'nonexistent' });

        // expect the response to have a status of 200 and the JSON body to have exists: 0
        expect(res.status).toBe(200);
        expect(res.body.exists).toBe(0);
    });
});