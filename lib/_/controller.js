class AbstractController {

    /**
     * The base path of this controller
     * @type null|string
     */
    basePath = null;

    /**
     * The base layout that will be used in the entire controller
     * @type null|string
     */
    layout = null;

    /**
     * 
     * @param {*} deps 
     */
    constructor(deps) {
        this.deps = deps;

        this.basePath = Object.freeze(this.basePath);
        this.layout = Object.freeze(this.layout);
    }

    /**
     * Initialize the render context. 
     * It helps to setup the base layout and other calculation if necessary to add
     * to the context of the renderer
     */
    initRendererContext() {
        // TODO: Imprive theses if blocks
        if (!this.basePath && this.layout) {
            return {
                layout: this.layout,
                basePath: "/"
            }
        }

        if (this.basePath && !this.layout) {
            return {
                basePath: this.basePath,
                layout: false
            }
        }

        return {
            basePath: this.basePath,
            layout: this.layout
        }
    }

}

exports.AbstractController = AbstractController;
