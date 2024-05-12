// eslint-disable-next-line no-unused-vars
const AbstractDatabase = require("./database.interface");

class AbstractDatabaseDao {
    /**
     * @param {AbstractDatabase} db
     * @param {Object} config
     */
    constructor(db) {
        this.db = db;

        this.initialized = this.db.initializeModel(this, this.options);
        this.collectionName = this.options.name;
    }

    // eslint-disable-next-line class-methods-use-this
    get options() {
        return {
            name: null,
        };
    }

    /**
     * @param {any} id
     * @returns Promise<any|null>
     */
    async findById(id) {
        return this.initialized.then(() => this.db.findById(this.collectionName, id));
    }

    /**
     * @param {Object} criteria
     * @param {Object} order
     * @param {int|null} limit
     * @param {int|null} offset
     * @returns Promise<any[]>
     */
    async findBy(criteria, order, limit, offset) {
        return this.initialized.then(() => this.db.find(this.collectionName, {
            ...criteria,
        }, {
            limit: parseInt(limit, 10), order, skip: offset ? parseInt(offset, 10) : 0,
        }));
    }

    /**
     * @param {Object} criteria
     * @returns Promise<any|null>
     */
    async findOneBy(criteria) {
        const result = await this.initialized.then(() => this.db.find(this.collectionName, {
            ...criteria,
        }, {
            limit: 1,
        }));

        if (Array.isArray(result)) {
            if (result.length === 0) {
                return null;
            }
            return result[0];
        }

        return result;
    }

    /**
     * @param {Object} data
     * @returns Promise<any>
     */
    async create(data, options) {
        return this.initialized.then(() => this.db.create(this.collectionName, {
            ...data,
        }, options));
    }

    /**
     * @param {Object} data
     * @returns Promise<any>
     */
    async update(data, options) {
        return this.initialized.then(() => this.db.update(this.collectionName, {
            ...data,
        }, options));
    }

    /**
     * @param {Object} query
     * @returns Promise<any>
     */
    async remove(query) {
        return this.initialized.then(() => this.db.delete(this.collectionName, query));
    }

    /**
     * @param {Object} query
     * @returns Promise<any>
     */
    async count(query) {
        return this.initialized.then(() => this.db.count(this.collectionName, query));
    }

    /**
     * @param {string} collectionName
     * @param {string} id
     * @returns
     */
    async removeById(id) {
        return this.initialized.then(() => { return this.db.deleteById(this.collectionName, id); });
    }
}

exports.AbstractDatabaseDao = AbstractDatabaseDao;
