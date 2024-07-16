class InMemoDatabase {

    /**
     * @type Map<number, any>
     */
    data = new Map();

    constructor(args) {
        this.count = args.count;
    }

    /**
     * 
     * @param {Object} data 
     */
    insert(data) {
        const id = this.data.size + 1;
        this.data.set(id, data);
    }

    /**
     * 
     * @param {number} id 
     * @returns element or undefined if not founds
     */
    getOne(id) {
        return this.data.get(id);
    }

    /**
     * 
     * @returns {Array<any>} all elements in the database
     */
    get() {
        return Array.from(this.data.values());
    }

    /**
     * Remove all data from the array
     */
    empty() {
        this.data.clear();
    }

}

module.exports.InMemoDatabase = InMemoDatabase;
