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
const { Environment} = require("./_/environement");


class Kernel {

    #showRoutes = false;
    #routes = [];
    #debug = true;
    #options = {};
    /**
     * @type Array<Promise<any>>
     */
    #$postInitPromises = [];

    /**
     * @type Array<Promise<any>>
     */
    #$preDestroyPromises = [];

    /**
     * 
     * @param {Object} entry 
     * @param {Object} options 
     */
    constructor(app, entry, options) {
        this.app = app;

        this.container = {
            services: {},
            routers: [],
            controllers: [],
            modules: {},
            exports: {}
        }

        this.#showRoutes = options.showRoutes || false;
        this.#debug = options.debug || true;
        this.#options = options;
        this.controllerFunctionWhiteList = ["postInit", "preDestroy", "asyncPostInit", "asyncPreDestroy"];

        this.Environment = new Environment({
            debug: options.env?.debug ?? true,
        });
    }

    get postInitPromises() {
        return this.#$postInitPromises;
    }

    get routes() {
        return this.#routes;
    }

    /**
     * Log message
     * @param {string} msg 
     * @param {boolean} force 
     */
    #log(msg, force = false) {
        if (this.#debug || force === true) {
            console.info("[DULARNO]", msg);
        }
    }

    /**
     * Bootstrap the application.
     * 
     * It loads modules based on dependencies between them
     * @param {*} root the application root modules definitions
     */
    bootstrap(root) {
        //base providers
        this.#loadProviders(null, root.providers);

        //Modules and their providers enqueued
        const modulesInstancesQueue = new Queue();
        for (const m of root.modules) {
            modulesInstancesQueue.enqueue(m);
        }

        //return;

        while (modulesInstancesQueue.isEmpty == false) {
            const module = modulesInstancesQueue.dequeue();
            module.imports = module.imports || [];
            module.middlewares = module.middlewares || [];

            const middlewaresBefore = module.middlewares.filter((el) =>  el.action === "before");
            const middlewaresAfter = module.middlewares.filter((el) =>  el.action === "after");

            if (module.imports.length == 0) {
                // TODO: Hummm Duplicated code, do something
                this.#loadProviders(module);
                this.#loadModuleGlobalMiddlewares(module, middlewaresBefore);
                this.#loadControllers(module);
                this.#loadModuleGlobalMiddlewares(module, middlewaresAfter);
                this.container.modules[module.name] = module;
            } else {
                let allImports = true;
                for (const imp of module.imports) {
                    allImports = allImports && this.container.modules[imp] !== undefined;
                }

                if (allImports) {
                    this.#loadProviders(module);
                    this.#loadModuleGlobalMiddlewares(module, middlewaresBefore);
                    this.#loadControllers(module);
                    this.#loadModuleGlobalMiddlewares(module, middlewaresAfter);
                    this.container.modules[module.name] = module;
                } else {
                    modulesInstancesQueue.enqueue(module);
                }
            }
        }

        //Manage exports
        this.#log("Bootstrap finised");
    }

    #loadModuleGlobalMiddlewares(module, middlewares){
        for (const miw of middlewares) {
            const clazzs = miw.clazzs || [];
            clazzs.forEach((str) => {
                const service = this.container.services[module.name][str];
                if (!service) {
                    throw Error(`Can't load Middleware ${str} from module ${module.name}`);
                }

                this.app.use(miw.path, service.handle.bind(service));
            });
        }
    }

    /**
     * Load controller of a given module
     * @param {*} ctrl 
     * @param {Router} router 
     * @param {Object} module 
     */
    #process_controller_function(ctrl, router, module) {
        const methods = getClassMethods(ctrl);

        for (const method of methods) {
            if (this.controllerFunctionWhiteList.includes(method)) {
                continue;
            }

            // Won't process private methods
            if (method.startsWith("#")) {
                continue;
            }

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

            let routeStr = ""
            for (m of route_methods) {
                routeStr = `Route: ${m.toUpperCase().padEnd(7, " ")} ${finalPath}`;
                this.#routes.push(routeStr);
                if (this.#showRoutes) {
                    this.#log(routeStr);
                }

                router[m](finalPath, middlewares, ctrl[method].bind(ctrl));
            }
        }
    }

    /**
     * For a given module load its controllers
     * @param {Object} module the module to be used
     */
    #loadControllers(module) {
        this.container.controllers[module.name] = this.container.controllers[module.name] || {};
        this.container.routers[module.name] = this.container.routers[module.name] || [];

        module.controllers = module.controllers || [];
        if (module.controllers.length === 0) {
            this.#log(`No controllers defined for module: ${module.name}`);
            return
        }

        for (const controllerName of module.controllers) {
            const router = Router();
            this.#process_controller_function(
                this.container.services[module.name][controllerName],
                router,
                module
            );

            this.app.use("", router);
            this.container.routers.push(router);
        }
    }

    /**
     * Load a service or a provider of a given module. A provider permit to have on ly one instance
     * of a given class and injects all needed dependencies
     * @param {*} module the entire module. the name attribute is required
     * @param {*} key the name of the instance that wille created with the given class
     * @param {*} clazz the class to instance
     * @param {*} deps an array of dependencies that need to be injected into the isntance created
     * @param {*} args  an object of additional arguments, key-value pairs configuration type
     */
    #loadService(module, key, clazz, deps, args) {
        module = module || { name: "default", imports: []};
        module.imports = module.imports || [];

        this.container.services[module.name] = this.container.services[module.name] || {};

        if (deps == null) {
            this.container.services[module.name][key] = new clazz(args);
            this.container.services[module.name][key]["Environment"] = this.Environment;
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
                args || {}
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

            // Inject the Environment
            if (!this.container.services[module.name][key]["Environment"]) {
                Object.defineProperty(
                    this.container.services[module.name][key],
                    "Environment", { value: this.Environment, writable: false }
                );
            }

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

    /**
     * Load providers from a given module. A provider is just a class that need to be instanciated once
     * @param {Object} module the module to be used
     * @param {Object} providers a key-value like pairs of classes taht need to be instanciated once.
     * Each provider has the class to instanciate, the name to the isntance, a list of dependencies and an object of arguments
     */
    #loadProviders(module, providers) {
        module = module || { name: "default", providers };
        this.container.services[module.name] = this.container.services[module.name] || {};


        const singleton = module.providers || {};
        const servicesInstancesQueue = new Queue();

        for (const key of Object.keys(singleton)) {
            const el = singleton[key];
            el.deps = el.deps || [];
            el.arguments = el.arguments || {};
            if (el.deps.length > 0) {
                servicesInstancesQueue.enqueue({ key, el });
            } else {
                this.#loadService(module, key, el.class, null, el.arguments);
            }
        }



        while (servicesInstancesQueue.isEmpty == false) {
            const { key, el } = servicesInstancesQueue.dequeue();
            el.arguments = el.arguments || {};

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

        for (const providerName of  Object.keys(this.container.services[module.name])) {
            this.#log("Provider Name: ", providerName, module);
            const provider = this.container.services[module.name][providerName];
            if (typeof provider.postInit === "function") {
                provider.postInit();
                this.#log(`Service ${providerName} postInit is called`);
            } else {
                this.#log(`Service ${providerName} has no postInit`);
            }

            if (typeof provider.asyncPostInit === "function") {
                this.#$postInitPromises.push(provider.asyncPostInit());
            }

        }
        
    }

    /**
     * Shutdown the kernel with it all ressources
     */
    async shutdown() {
        const modulesNames = Object.keys(this.container.modules);
        modulesNames.push("default"); // The default must be the last module to be removed

        for (const moduleName of  modulesNames) {
            for (const providerName of  Object.keys(this.container.services[moduleName])) {
                const provider = this.container.services[moduleName][providerName];
                if (typeof provider.preDestroy === "function") {
                    provider.preDestroy();
                    this.#log(`Service ${providerName} preDestroy has been called`);
                } else {
                    this.#log(`Service ${providerName} has no preDestroy`);
                }

                if (typeof provider.asyncPreDestroy === "function") {
                    this.#$preDestroyPromises.push(provider.asyncPreDestroy());
                }

            }
        }

        // Wait for all destroy promises to be resolved
        await Promise.all(this.#$preDestroyPromises);
    }

    /**
     * Destroy the lernel
     */
    async destroy() {
        // Delete everything
        delete this.container;
    }

}

/**
 * 
 * @param {*} modules 
 * @param {*} app 
 */
module.exports.bootstrap = function (entry, app, options={showRoutes: true}) {
    const kernel = new Kernel(app, entry, options);

    kernel.bootstrap(entry);

    return {
        kernel,
        fn: {
            /**
             * When the application has loaded
             */
            ready: async() => {
                try {
                    await Promise.all(kernel.postInitPromises);
                } catch (error) {
                    throw error;
                }
            },
            /**
             * 
             * @returns 
             */
            shutdown: async () => {
                try {
                    await kernel.shutdown();
                } catch (error) {
                    throw error;
                }
            },
            /**
             * 
             * @returns 
             */
            destroy: async () => {
                try {
                    await kernel.destroy();
                } catch (error) {
                    throw error;
                }
            }
        }
    }

    //console.log(kernel.container);
}
module.exports.env = Environment.env;
module.exports.application = express;

exports.AbstractController = AbstractController;
exports.AbstractMiddleware = AbstractMiddleware;
exports.AbstractService = AbstractService;
exports.AbstractRepository = AbstractRepository;
exports.AbstractDatabaseDao = AbstractDatabaseDao;
exports.AbstractDatabase = AbstractDatabase;
