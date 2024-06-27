import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from '@/router';
import * as axios from '@/api.js';
import '@/style/common.less';
import store from './store';

Vue.prototype.$axios = axios;
Vue.prototype.$static = {
  school_id: '',
  student_id: '',
};
Vue.config.productionTip = false
Vue.use(Antd);

new Vue({
  store,
  render: h => h(App),
  router,
}).$mount('#app')
