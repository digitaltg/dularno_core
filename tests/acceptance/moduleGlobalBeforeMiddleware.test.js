const request = require("supertest");
const { app, boot } = require("../../examples/moduleGlobalBeforeMiddleware");

describe("Dularno: Module Global before middleware", () => {

    it("Should increase deafault value by one in the before middleware", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .post("/before")
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

    it("Should increase the value in body by one in the before middleware", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .post("/before")
            .send({value: 2})
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.value).toBe(3);

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

    it("Should not increase deafault value by one in the before middleware", (done) => {
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

    it("Should not increase the value in body by one in the before middleware", (done) => {
        boot.fn.ready().then(() => {
            request(app)
            .post("/none")
            .send({value: 2})
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
