const { TodoController } = require("../../../examples/sample/controller")

describe("Controller: initRendererContext", () => {

    const defaultBasePath = "/basePath";
    const defaultLayout = "baseLayout";

    test("Should have basePath and layout to be null", () => {

        class BController extends TodoController {
            constructor(deps) {
                super(deps);
            }
        }

        const context = (new BController()).initRendererContext();

        expect(context.basePath).toBe(null);
        expect(context.layout).toBe(null);
    });

    test("Should fail when modifying layout", () => {

        class BController extends TodoController {
            layout = defaultLayout;
            constructor(deps) {
                super(deps);
            }
        }

        const ctrl = (new BController())
        ctrl.basePath = "do not do this";
        
        // We need to have the value unchanged 
        expect(ctrl.layout).toBe(defaultLayout);
    });

    test("Should have return only basePath", () => {

        class BController extends TodoController {
            basePath = defaultBasePath;
            layout = null;

            constructor(deps) {
                super(deps);
            }
        }

        const context = (new BController()).initRendererContext();

        expect(context.basePath).toBe(defaultBasePath);
        expect(context.layout).toBe(undefined);
    });

    test("Should have return only layout", () => {

        class BController extends TodoController {
            basePath = null;
            layout = defaultLayout;

            constructor(deps) {
                super(deps);
            }
        }

        const context = (new BController()).initRendererContext();

        expect(context.basePath).toBe(undefined);
        expect(context.layout).toBe(defaultLayout);
    });

    test("Should have return both layout and basePath", () => {

        class BController extends TodoController {
            basePath = defaultBasePath;
            layout = defaultLayout;

            constructor(deps) {
                super(deps);
            }
        }

        const context = (new BController()).initRendererContext();

        expect(context.basePath).toBe(defaultBasePath);
        expect(context.layout).toBe(defaultLayout);
    });

} )
