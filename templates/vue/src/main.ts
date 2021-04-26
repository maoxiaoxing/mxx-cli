import 'babel-polyfill' // 兼容ie

import Vue from 'vue'
import App from './app.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: (h: any) => h(App)
}).$mount('#app')

