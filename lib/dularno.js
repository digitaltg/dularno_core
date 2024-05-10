const express = require("express");
const Router = express.Router;

const Queue = require("./helper/queue");
const { getClassMethods, getParams } = require("./helper/clazz");
const { AbstractController } = require("./_/controller");
const { AbstractMiddleware } = require("./_/middleware");
const { AbstractService } = require("./_/service");
const { AbstractRepository } = require("./_/repository");
const { AbstractDatabaseDao } = require("./_/database/dao.interface");
const AbstractDatabase = require("./_/database/database.interface");


class Kernel {

    /**
     * 
     * @param {Object} entry 
     * @param {Object} options 
     */
    constructor(entry, options) {
        this.container = {
            services: {},
            routers: [],
            controllers: [],
            modules: {},
            exports: {}
        }

        this.showRoutes = options.showRoutes || false;
    }

    bootstrap(options) {
        //base providers
        this.#loadProviders(null, options.providers);

        //Modules and their providers
        const modulesInstancesQueue = new Queue();
        for (const m of options.modules) {
            modulesInstancesQueue.enqueue(m);
        }

        //return;

        while (modulesInstancesQueue.isEmpty == false) {
            const module = modulesInstancesQueue.dequeue();
            module.imports = module.imports || [];

            if (module.imports.length == 0) {
                this.#loadProviders(module);
                this.#loadControllers(module);
                this.container.modules[module.name] = module;
            } else {
                let allImports = true;
                for (const imp of module.imports) {
                    allImports = allImports && this.container.modules[imp] !== undefined;
                }

                if (allImports) {
                    this.#loadProviders(module);
                    this.#loadControllers(module);
                    this.container.modules[module.name] = module;
                } else {
                    modulesInstancesQueue.enqueue(module);
                }
            }
        }

        //Manage exports
        console.log("Bootstrap finised");
    }

    /**
     * 
     * @param {*} ctrl 
     * @param {Router} router 
     * @param {Object} module 
     */
    #process_controller_function(ctrl, router, module) {
        const methods = getClassMethods(ctrl);

        for (const method of methods) {
            let [route_methods, m] = method.split("__");
            route_methods = route_methods.split("_");

            const args = getParams(ctrl[method], false);
            let middlewares = [];

            if (args.middlewares) {
                const arr = args.middlewares.split("->").map((t) => t.trim()); //eval(args.middlewares);
                if (Array.isArray(arr) == false) {
                    throw new Error("Middlewares must be an array of strings")
                }
                middlewares = arr.map((middlewareClassName) => {
                    if (!this.container.services[module.name][middlewareClassName]) {
                        throw new Error(`Middleware ${middlewareClassName} not found in module`)
                    }

                    return this.container.services[module.name][middlewareClassName].handle.bind(this.container.services[module.name][middlewareClassName]);
                });

            }

            // Add base path
            let finalPath = args.path;
            if (ctrl.basePath) {
                finalPath = ctrl.basePath + "/" + finalPath
                finalPath = finalPath
                    .replace("///", "//")
                    .replace("//", "/"); // To avoid double /
            }

            for (m of route_methods) {
                router[m](finalPath, middlewares, ctrl[method].bind(ctrl));
            }
        }
    }

    #loadControllers(module) {
        this.container.controllers[module.name] = this.container.controllers[module.name] || {};
        this.container.routers[module.name] = this.container.routers[module.name] || [];

        for (const controllerName of module.controllers) {
            const router = Router();
            this.#process_controller_function(
                this.container.services[module.name][controllerName],
                router,
                module
            );
            this.container.routers.push(router);
        }
    }


    #loadService(module, key, clazz, deps, args) {
        module = module || { name: "default", imports: []};
        module.imports = module.imports || [];

        this.container.services[module.name] = this.container.services[module.name] || {};

        if (deps == null) {
            this.container.services[module.name][key] = new clazz(...args);
        } else {

            const depsInstances = {};
            deps.forEach((d) => {
                let obj = this.container.services[module.name][d];
                if (!obj) {
                    obj = this.container.services['default'][d];
                }
                depsInstances[d] = obj;
            });

            this.container.services[module.name][key] = new clazz(
                depsInstances,
                ...args
            );

            deps.forEach((d) => {
                let obj = this.container.services[module.name][d];
                if (!obj) {
                    obj = this.container.services['default'][d];
                }

                Object.defineProperty(
                    this.container.services[module.name][key],
                    d, { value: obj, writable: false }
                );
            })

            //TODO: 🙃 Uhummm
            delete this.container.services[module.name][key].deps;
        }

        if (module.imports.length) {
            for (const imp of module.imports) {
                this.container.modules[imp].exports = this.container.modules[imp].exports || [];
                this.container.exports[imp] = this.container.exports[imp] || {}

                if (Object.keys(this.container.exports[imp]).length == 0) {
                    this.container.exports[imp] = {};

                    this.container.modules[imp].exports.forEach((key) => {
                        this.container.exports[imp][key] = this.container.services[imp][key];
                    });
                }

                Object.defineProperty(
                    this.container.services[module.name][key],
                    imp, { value: this.container.exports[imp], writable: false }
                );
            }
        }
    }

    #loadProviders(module, providers) {
        module = module || { name: "default", providers };
        this.container.services[module.name] = this.container.services[module.name] || {};


        const singleton = module.providers || {};
        const servicesInstancesQueue = new Queue();

        for (const key of Object.keys(singleton)) {
            const el = singleton[key];
            if (el.deps.length > 0) {
                servicesInstancesQueue.enqueue({ key, el });
            } else {
                this.#loadService(module, key, el.class, null, el.arguments);
            }
        }



        while (servicesInstancesQueue.isEmpty == false) {
            const { key, el } = servicesInstancesQueue.dequeue();
            el.arguments = el.arguments || [];

            if (el.deps.length > 0) {
                let allDeps = true;
                for (const d of el.deps) {
                    allDeps = allDeps & (
                        this.container.services[module.name][d] != undefined ||
                        this.container.services['default'][d] != undefined
                    );
                }

                if (allDeps) {
                    this.#loadService(module, key, el.class, el.deps, el.arguments);
                } else {
                    servicesInstancesQueue.enqueue({ key, el });
                }
            } else {
                this.#loadService(module, key, el.class, null, el.arguments);
            }
        }
    }

}

/**
 * 
 * @param {*} modules 
 * @param {*} app 
 */
module.exports.bootstrap = function (entry, app, options={showRoutes: true}) {
    const kernel = new Kernel(entry, options);
    kernel.bootstrap(entry);
    //TODO: bring all things here
    //Routers
    for (const router of kernel.container.routers) {
        app.use("", router)
    }

    //console.log(kernel.container);
}

module.exports.application = express;

exports.AbstractController = AbstractController;
exports.AbstractMiddleware = AbstractMiddleware;
exports.AbstractService = AbstractService;
exports.AbstractRepository = AbstractRepository;
exports.AbstractDatabaseDao = AbstractDatabaseDao;
exports.AbstractDatabase = AbstractDatabase;
