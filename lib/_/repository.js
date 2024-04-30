class AbstractRepository {

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
    async find(id) {}

    /**
     * 
     * @param {Object} criteria 
     * @param {Object} order 
     * @param {int|null} limit 
     * @param {int|null} offset
     * @returns Promise<any[]>
     */
    async findBy(criteria, order, limit, offset) {}

    /**
     * 
     * @param {Object} criteria
     * @returns Promise<any|null>
     */
    async findOneBy(criteria) {}

    /**
     * 
     * @param {Object} data
     * @returns Promise<any>
     */
    async create(data, options) {}

    /**
     * 
     * @param {Object} data
     * @returns Promise<any>
     */
    async update(data, options) {}


    /**
     * 
     * @param {Object} data
     * @returns Promise<any>
     */
    async remove(data, options) {}

    
}

exports.AbstractRepository = AbstractRepository;