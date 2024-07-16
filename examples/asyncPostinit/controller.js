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
        this.Database.insert({ id: 1, name: "task_1" });
        this.calledAsyncPostInit = true;
    }

    get__list(req, res, next, path = '/test') {
        return res.json({v: this.calledAsyncPostInit});
    }
}

module.exports.TodoController = TodoController;
