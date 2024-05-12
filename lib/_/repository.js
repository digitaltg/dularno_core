const { AbstractDatabaseDao } = require("./database/dao.interface");

class AbstractRepository {

    /**
     * @type {AbstractDatabaseDao}
     */
    dao = null;

    /**
     * 
     * @param {*} deps 
     */
    constructor(deps) {
        this.deps = deps;
    }

    /**
     * 
     * @param {any} id
     * @returns Promise<any|null>
     */
    async findById(id) {
        return this.dao.findById(id);
    }

    /**
     * 
     * @param {Object} criteria 
     * @param {Object} order 
     * @param {int|null} limit 
     * @param {int|null} offset
     * @returns Promise<any[]>
     */
    async findBy(criteria, order, limit, offset) {
        return this.dao.findBy(criteria, order, limit, offset);
    }

    /**
     * 
     * @param {Object} criteria
     * @returns Promise<any|null>
     */
    async findOneBy(criteria) {
        return this.dao.findOneBy(criteria);
    }

    /**
     * 
     * @param {Object} data
     * @returns Promise<any>
     */
    async create(data, options) {
        return this.dao.create(data, options);
    }

    /**
     * 
     * @param {Object} data
     * @returns Promise<any>
     */
    async update(data, options) {
        return this.dao.update(data, options);
    }


    /**
     * 
     * @param {Object} data
     * @returns Promise<any>
     */
    async remove(query) {
        return this.dao.remove(query);
    }

    /**
     * 
     * @param {string} id 
     */
    async removeById(id) {
        return this.dao.removeById(id);
    }

    /**
     * 
     * @param {Object} query 
     * @returns 
     */
    async count(query) {
        return this.dao.count(query);
    }

    
}

exports.AbstractRepository = AbstractRepository;
