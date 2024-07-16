const request = require("supertest");
const { app, boot } = require("../../examples/asyncPostinit");

describe("Dularno:Service Async Postinit", () => {

    it("Should call async postIinit after initialzsation", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .get("/test")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.v).toBe(true);
                done();
            });
        }).catch((err) => {
            throw Error("App Bootstrap failed to finish")
        });
        
    });

});
