// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import VueLazyLoad from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import {currency} from './util/currency';
import axios from 'axios';
import VModal from 'vue-js-modal';
import 'font-awesome/css/font-awesome.css';

Vue.prototype.axios = axios
// 全局配置axios的头信息
axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = localStorage.getItem('token')
    return config;
  });

Vue.config.productionTip = false;

/*全局过滤器 价格格式化*/
Vue.filter('currency',currency);

Vue.use(infiniteScroll);

Vue.use(Vuex);

Vue.use(VueLazyLoad,{
  loading: '/static/loading-svg/loading-bars.svg',
})

Vue.use(VModal, {componentName: "v-modal",dialog: true })

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount: 0
  },
  mutations:{
    /*用户名*/
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    /*购物车数量*/
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    },

    /*初始化购物车数量*/
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    }
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
