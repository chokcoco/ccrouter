import hashRouterMap from "./hashRouter/index"

export default class Router {

    /**
     * 路由容器 id
     * @param {String} id 
     */
    constructor(id) {
        this._routerContainer = document.getElementById(id);

        if (!this._routerContainer) {
            throw new Error(`Can not get #${id} routerContainer, please confirm document.getElementById(${id}) is exist...`)
        }

        // cahce
        this._cache = [];

        // middleware 
        this._middleware = [];

        // routes array
        this.routes = new hashRouterMap();

        this._init();
    }

    _init() {

        // 初始化 hash 监听函数
        this._listen = () => {
            const path = this._getHash();
            const matchedRoutes = this.routes.match(path);

            // 路由匹配结果
            this._matchedCount = matchedRoutes.length;
            // 执行路由
            this._fireHandlers(matchedRoutes, this._cache[path]);
        }

        // 设置监听器
        window.addEventListener('load', this._listen)
        window.addEventListener('hashchange', this._listen)
    }

    /**
     * 执行路由
     * @param {Array} matchedRoutes 
     * @param {*} body 
     */
    _fireHandlers(matchedRoutes, body) {

        matchedRoutes.map((item) => {

            // const cache = this._getCache(item)

            const request = {
                body: body,
                query: item.query,
                params: item.params
            }

            this._def(request, 'route', item.path)
            this._def(request, 'url', item.url)

            if (!body) {
                request._id = item._id;
            }   

            // 执行渲染 handler
            item.handler(request);

            // this._cacheBody(body, item);
        });
    }

    /**
     * current hash
     */
    _getHash() {
        return location.hash.slice(1);
    }

    _def(obj, key, value) {

        Object.defineProperty(obj, key, {
            writable: false,
            enumerable: true,
            value: value
        })
    }

    /**
     * 注册路由规则
     * 
     * @param {String} path 
     * @param {obj} middleware 上下文
     */
    route(path, middleware) {

        this.routes.add(path, (req) => {

            if (req.path !== '*') {
                // 渲染前先经过中间件处理
                this._middleware.map((item) => {
                    item(req);
                });
            }

            console.log('实际渲染', middleware, req, this);

            // 实际渲染
            middleware(req, this);
        });
    }

    render(tpl) {
        this._routerContainer.innerHTML = tpl;
    }

    /**
     * 将中间件添加到中间件栈中
     */
    use(req) {
        this._middleware.push(req);
    }

    back() {
        history.go(-1);
    }

    go(url) {
        location.hash = url;
    }
}