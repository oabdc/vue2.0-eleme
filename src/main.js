// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 入口
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'
import './common/sass/index.scss'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueResource)
//定义全局变量
window.bus = new Vue();

// 2.定义路由
const routes = [
  {path: '', component: goods},
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
]
// 3.创建 router实例 传router配置
const router = new VueRouter({
  // 缩写相当于 routes:routes
  routes,
  linkActiveClass:'active'

})

// 4.创建和挂载根实例
// 要通过router配置参数注入路由 从而让整个应用都有路由功能
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

