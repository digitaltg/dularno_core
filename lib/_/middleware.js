const { Request, Response, NextFunction } = require("express");

class AbstractMiddleware {
    constructor(deps) {
    }


    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    async handle(req, res, next) { 
        return next();
    }
}

module.exports.AbstractMiddleware = AbstractMiddleware