/**
 * A map-like class that maps resource linkage objects {id: 1, type: "user"} to concrete resources with attributes and
 * relationships
 */
export default class ResourceLookup {
    lookup: Map<any, any>;
    includes: string[];
    /**
     * Constructs a new lookup map
     * @param {Object} response A JSON API response, in JSON format
     */
    constructor(response: any);
    /**
     * Calculates a hashable key for JSON API resources
     * @param resource A resource linkage object
     * @returns {string}
     */
    getKey(resource: any): string;
    /**
     * Looks up a resource
     * @param resource A resource linkage object
     * @returns {Object}
     */
    get(resource: any): any;
    /**
     * Returns true if the resource is in the lookup
     * @param resource
     * @returns {boolean}
     */
    has(resource: any): boolean;
    /**
     * Converts a JSON API data object (with id, type, and attributes fields) into a flattened object
     * @param {Object} response A JSON API data object
     */
    unwrapData(response: any, includes: string[]): any;
}
