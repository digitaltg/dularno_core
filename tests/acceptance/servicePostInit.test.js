const request = require("supertest");
const app = require("../../examples/servicePostinit");

describe("Dularno:Service Postinit", () => {

    it("Should call postIinit after initialzsation", (done) => {
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

});
