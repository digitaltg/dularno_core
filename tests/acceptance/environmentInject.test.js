const request = require("supertest");
const { app, boot } = require("../../examples/environment");

describe("Dularno:Service Auto Env injections", () => {

    it("Should have env defined variables starting with APP_", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .get("/test")
            // .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.env).toBe(true);
                expect(response.body.value).toBe("APP_TEST_ARG");
                done();
            });
        }).catch((err) => {
            throw Error("App Bootstrap failed to finish")
        });
        
    });

});
