require('./html/index.html');
require('./sass/index.scss');

import "babel-polyfill";
import Router from "./js/router/index.js"
import home from "./js/pages/home";
import mine from "./js/pages/mine";

const router = new Router('g-router');


router.route('home', home);
router.route('mine', mine);
router.route('*', home);

// 使用路由中间件
router.use((req) => {
    if(!req.body) {
        req.body = {};
        req.body.curday = '' + new Date();
    }
})


document.querySelectorAll('.j-home')[0].addEventListener("click", (event) => {
    router.go('home');
});

document.querySelectorAll('.j-mine')[0].addEventListener("click", (event) => {
    router.go('mine');
});

document.querySelectorAll('.j-back')[0].addEventListener("click", (event) => {
    router.back();
});