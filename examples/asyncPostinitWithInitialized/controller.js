const { AbstractController } = require("../..");
const { InMemoDatabase } = require("../dummy/database");

class TodoController extends AbstractController {

    /**
     * @type {InMemoDatabase}
     */
    Database = null;

    calledAsyncPostInit = false;

    constructor(deps) {
        super(deps);
    }

    async asyncPostInit() {
        await new Promise((resolve) => {
            setTimeout(() => {
                this.calledAsyncPostInit = true;
                resolve();
            }, 20);
        });
    }

    async get__list(req, res, next, path = '/test') {
        return res.json({v: this.calledAsyncPostInit, init: await this.initialized});
    }
}

module.exports.TodoController = TodoController;
