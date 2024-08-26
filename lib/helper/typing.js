/* eslint-disable no-restricted-globals */

const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

class TypeTool {
    /**
     * Infer the correct type of a given string value
     * @param {String} str
     * @returns
     */
    static infer(str) {
        // Check for boolean values
        if (str.toLowerCase() === "true") return true;
        if (str.toLowerCase() === "false") return false;

        // Check for number values
        if (!isNaN(str) && str.trim() !== "") return Number(str);

        // Check for JSON objects
        try {
            const obj = JSON.parse(str);
            if (typeof obj === "object" && obj !== null) return obj;
        } catch (e) {
            // Not a JSON string
        }

        // Check for Date
        if (dateRegex.test(str)) {
            const date = new Date(str);
            if (!isNaN(date.getTime())) return date;
        }

        // If no conversion is possible, return the original string
        return str;
    }
}

module.exports.TypeTool = TypeTool;
