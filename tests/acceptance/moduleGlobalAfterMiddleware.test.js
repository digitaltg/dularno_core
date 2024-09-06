const request = require("supertest");
const { app, boot } = require("../../examples/moduleGlobalAfterMiddleware");

describe("Dularno: Module Global after middleware", () => {

    it("Should increase default value by one in the after middleware", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .post("/after")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.value).toBe(1);

                // Shut down the app
                boot.fn.shutdown().then(() => {
                    
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

    it("Should increase the value in body by one in the after middleware", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .post("/after")
            .send({value: 3})
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.value).toBe(4);

                // Shut down the app
                boot.fn.shutdown().then(() => {
                    
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

    it("Should not increase default value by one in the after middleware", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .post("/none")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.value).toBe(-1);

                // Shut down the app
                boot.fn.shutdown().then(() => {
                    
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

    it("Should not increase the value in body by one in the after middleware", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .post("/none")
            .send({value: 3})
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.value).toBe(-1);

                // Shut down the app
                boot.fn.shutdown().then(() => {
                    
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
