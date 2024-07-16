const request = require("supertest");
const app = require("../../examples/basePathBaseLayout");

describe("Bootstap Dularno", () => {

    it("Should load the database provider", (done) => {
        request(app)
            .get("/api/v1/tasks")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(1);
                done();
            });
    });
});
