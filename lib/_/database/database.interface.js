class AbstractDatabase {
    constructor(config) {
        this.config = config;
    }

    // eslint-disable-next-line class-methods-use-this, no-empty-function
    async connect() { }

    // eslint-disable-next-line class-methods-use-this, no-empty-function
    async disconnect() { }

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async createCollection(name, options) { }

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async hasCollection(name) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async find(collection, query, options) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async findById(collection, id, options) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async create(collection, doc) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async read(collection, query, options) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async update(collection, doc, context) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async delete(collection, query) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async deleteById(collection, id) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async count(collection, query, options) {}

    // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
    async initializeModel(dao, modelOptions) { }
}

module.exports = AbstractDatabase;
