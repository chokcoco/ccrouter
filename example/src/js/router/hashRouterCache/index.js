
export default class hashRouterMap {
    constructor() {

        this.cachePrifix = 'crouter';

        this._cache = [];
    }

    getCache(item) {
        return this._getCache(item._id);
    }

    setCache(item, body) {
        this._setCache(item._id. body);
    }

    /**
     * 使用 sessionStorage 进行 cache 缓存
     * 
     * @param {string} id 
     * @param {Object} body 
     */
    _setCache(id, body) {
        if (!body) {
            return;
        } 

        sessionStorage.setItem(`${this.prefix}${id}`, JSON.stringify(body));
    }

    /**
     * 取出缓存
     * 
     * @param {string} id 
     * @returns {Object} cache 
     */
    _getCache(id) {
        try {
            const cache = sessionStorage.getItem(`${this.prefix}${id}`);
            
            return cache ? JSON.parse(cache) : "";
        } catch (err) {
            throw new Error('parse body err');
        }
    }
}