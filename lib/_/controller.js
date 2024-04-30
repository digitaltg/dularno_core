class AbstractController {

    /**
     * @type null|string
     */
    static basePath = null;

    /**
     * 
     * @param {*} deps 
     */
    constructor(deps) {
        this.deps = deps;
    }

}

exports.AbstractController = AbstractController;
