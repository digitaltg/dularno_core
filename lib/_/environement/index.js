const { TypeTool } = require("../../helper/typing");

const env = {};


class Environment {

    static env = {};

    constructor({debug}) {
        Object.keys(process.env).forEach((key) => {
            if (key.startsWith("APP_")) {
                Environment.env[key] = TypeTool.infer(process.env[key]);

                if (debug === false) {
                    console.info(key, "-----", Environment.env[key]);
                }

                this[key] = Environment.env[key];

                delete process.env[key];
            }
        });
    }
}

module.exports.Environment = Environment;
