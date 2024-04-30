const { getParams } = require("../../lib/helper/clazz");

describe("[Unit Test] Class Methods params", () => {



    test("Should return non default params", () => {
        const d = new D();
        let params = getParams(d.f, true);
        expect(
            params.includes("ret") &&
            params.includes("reu") &&
            params.includes("res") &&
            params.includes("req")
        ).toBe(true);
    });

    test("Should return default params", () => {
        const d = new D();
        let params = getParams(d.f, false);
        expect(
            params.path !== undefined &&
            params.path == "/path"
        ).toBe(true);
    });

    test("Should return multiple default params", () => {
        const d = new D();
        let params = getParams(d.f2, false);
        expect(
            params.path !== undefined &&
            params.path == "/path" && 
            params.path2 !== undefined &&
            params.path2 == "/path2"
        ).toBe(true);
    });
});

class D {
    f(ret, reu, path = '/path', res, req) {
        console.log("Function");
        this.#t();
    }

    f2(ret, reu, path = '/path', path2 = '/path2', res, req) {
        console.log("Function");
        this.#t();
    }

    r() {
        ;
        this.#t();
    }

    u_func() {
        this.#t();
    }

    #t() {
        console.log("Private");
    }
}
