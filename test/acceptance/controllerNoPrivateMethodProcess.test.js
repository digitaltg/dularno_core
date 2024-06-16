const request = require("supertest");
const app = require("../../examples/controllerNoPrivateMethodProcess");

describe("Dularno:Controller no private method process", () => {

    it("Should not process private method", (done) => {
        request(app)
            .get("/tasks")
            .expect(404, done)
    });

});
