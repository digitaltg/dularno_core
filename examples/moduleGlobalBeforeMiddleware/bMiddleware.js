const { AbstractService } = require("../../");

class BeforeMiddleware extends AbstractService {

    constructor(deps) {
        super(deps);
    }

    postInit() {
    }

    async preDestroy() {
    }

    async handle(req, res, next) {
        const oldValue =  req.body?.value ?? 0;
        req.value = oldValue + 1;
        return next();
    }
}

module.exports.BeforeMiddleware = BeforeMiddleware;
