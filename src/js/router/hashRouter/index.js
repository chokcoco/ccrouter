import path2Reg from 'path-to-regexp'

export default class hashRouterMap {
    constructor() {

        this._routes = [];
        this._id = 0;
    }

    /**
     * 返回路由匹配数组
     * @param {Strint} url hash
     */
    match(url) {
        let matchedRoutes = []
        let queryStr = ''
        let idx = url.indexOf('?')
        let notMatched = true

        if (idx > -1) {
            queryStr = url.substr(idx)
            url = url.slice(0, idx)
        }
        
        for(let i=0; i<this._routes.length; i++) {

            let route = this._routes[i];
            let result = route.reg.exec(url);

            if (result) {
                if (route.path !== '*') {
                    notMatched = false;
                } 

                // 如果当前已经匹配到非 * 路由，则在此处过滤 * 路由
                if(!notMatched && route.path === '*') {
                    continue;
                }

                // match result
                matchedRoutes.push({
                    _id: route._id,
                    path: route.path,
                    url: url + queryStr,
                    // params: this._getParams(route.params, result),
                    // query: parseQuery(queryStr),
                    handler: route.handler
                })                
            }
        }

        console.log('matchedRoutes', matchedRoutes);

        return matchedRoutes;
    }

    /**
     * add new routeConfig
     *
     * @param {string} path
     * @param {Function} handler
     * @memberof RouteMatcher
     */
    add(path, handler) {
        let complied = this._toReg({
            path: path,
            handler: handler
        });

        // generate unique id by register order
        complied._id = ++this._id;
        this._routes.push(complied);

        console.log('this._routes', this._routes);
    }

    _toReg(routeConfig) {
        routeConfig.params = [];
        routeConfig.reg = routeConfig.path === '*' ?
            /[\w\W]*/i :
            path2Reg(routeConfig.path, routeConfig.params, {
                end: false
            });

        return routeConfig;
    }
}