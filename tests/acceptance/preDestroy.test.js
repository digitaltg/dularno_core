const request = require("supertest");
const { app, boot } = require("../../examples/preDestroy");

describe("Dularno:Service Pre Destroy", () => {

    it("Should call sync preDestory after shutdhown", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .get("/tasks")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBe(1);

                // Shut down the app
                boot.fn.shutdown().then(() => {
                    request(app)
                    .get("/tasks")
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        expect(Array.isArray(response.body)).toBe(true);
                        expect(response.body.length).toBe(0);
                        done();
                    });
                }).catch((err) => {
                    console.error(err);
                    throw Error("App Bootstrap failed to shutdown")
                });
                done();
            });
        }).catch((err) => {
            console.error(err);
            throw Error("App Bootstrap failed to be ready")
        });
    });

});
