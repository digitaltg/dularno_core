const { AbstractController } = require("../../");
const { InMemoDatabase } = require("../dummy/database");

class TodoController extends AbstractController {

    /**
     * @type {InMemoDatabase}
     */
    Database = null;

    constructor(deps) {
        super(deps);
    }

    postInit() {
        this.Database.insert({ id: 1, name: "task_1" });
    }

    async preDestroy() {
        await new Promise((resolve) => {
            setTimeout(() => {
                this.Database.empty();
                resolve();
            }, 2000);
        });
    }

    get__list(req, res, next, path = '/tasks') {
        const data = this.Database.get()
        return res.json(data);
    }
}

module.exports.TodoController = TodoController;
