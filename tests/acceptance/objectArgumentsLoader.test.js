const request = require("supertest");
const app = require("../../examples/objectArgumentLoader");

describe("Dularno: Arguments as object", () => {

    it("Should pass arguements as object ", (done) => {
        request(app)
            .get("/test")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.db).toBe(1);
                expect(response.body.ctrl).toBe(2);
                done();
            });
    });

});
