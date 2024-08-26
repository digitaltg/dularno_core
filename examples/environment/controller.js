const { AbstractController } = require("../..");
const { InMemoDatabase } = require("../dummy/database");

class TodoController extends AbstractController {

    /**
     * @type {InMemoDatabase}
     */
    Database = null;

    constructor(deps) {
        super(deps);
    }

    get__env(req, res, next, path = '/test') {
        return res.json({
            env: this.Environment != null, 
            value: this.Environment.APP_TEST_ARG
        });
    }
}

module.exports.TodoController = TodoController;
