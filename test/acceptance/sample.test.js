const request = require("supertest");
const app = require("../../examples/sample");

describe("Bootstap Dularno", () => {

    it("Should load the database provider", (done) => {
        request(app)
            .get("/tasks")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(1);
                done();
            });
    });

    it("Should return 404 Not found", (done) => {
        request(app)
            .get("/task-does-not-exists")
            .expect(404, done);
    })

});
