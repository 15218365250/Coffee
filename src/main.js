import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import './plugins/axios'
import 'lib-flexible/flexible'
import './plugins/vant'
import VueCookies from 'vue-cookies'
import $ from 'jquery' //在需要使用的页面中


Vue.use(VueCookies)
Vue.config.productionTip = false
// Vue.prototype.allshopData = allshopData;
// 定义全局变量
let global = {
  // 改变导航条高亮
  swap: 1,
  // 商品详细信息
  prociData: {},
  // 控制详情页的显示隐藏
  showform: false,
  // 收藏商品
  colleData: [],
  // 计算购物车数量
  cutmusch: null,
  // 订单信息
  setUpdata: {
    id: ''
  }
}

Vue.config.productionTip = false
new Vue({
  router,
  store,
  $,
  data: {
    global,
  },
  render: h => h(App)
}).$mount('#app')
