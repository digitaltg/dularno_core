const request = require("supertest");
const { app, boot } = require("../../examples/asyncPostinitWithInitialized");

describe("Dularno:Service Async Postinit with initialized", () => {

    it("Should call async postIinit after initialzsation", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .get("/test")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.v).toBe(true);
                expect(response.body.init).toBe(true);
                done();
            });
        }).catch((err) => {
            throw Error("App Bootstrap failed to finish")
        });
        
    });

});
