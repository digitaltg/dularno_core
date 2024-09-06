const { AbstractController } = require("../../");
const { InMemoDatabase } = require("../dummy/database");

class TodoController extends AbstractController {

    constructor(deps) {
        super(deps);
    }

    postInit() {
    }

    async preDestroy() {
    }

    post__before(req, res, next, path = '/before') {
        // Get data from the before middleware
        
        return res.json({value: req.value});
    }

    post__none(req, res, next, path = '/none') {
        // Get data from the before middleware
        
        return res.json({value: -1});
    }
}

module.exports.TodoController = TodoController;
