const { AbstractService } = require("../../");

class AfterMiddleware extends AbstractService {

    constructor(deps) {
        super(deps);
    }

    postInit() {
    }

    async preDestroy() {
    }

    async handle(req, res, next) {
        const oldValue =  req.body?.value ?? 0;
        return res.json({value: oldValue + 1});
    }
}

module.exports.AfterMiddleware = AfterMiddleware;
