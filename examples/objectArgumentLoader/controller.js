const { AbstractController } = require("../../");
const { InMemoDatabase } = require("../dummy/database");

class TodoController extends AbstractController {

    /**
     * @type {InMemoDatabase}
     */
    Database = null;

    constructor(deps, args) {
        super(deps);
        this.count = args.count;
    }

    async asyncPostInit() {
        this.Database.insert({ id: 1, name: "task_1" });
    }

    get__list(req, res, next, path = '/test') {
        return res.json({ctrl: this.count, db: this.Database.count});
    }
}

module.exports.TodoController = TodoController;
