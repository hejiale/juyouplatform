import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './global'
import './api/config'
import './components'
import './element'
import 'normalize.css'
import './assets/styles/main.sass'
import './icons'
import store from './store'
// import 'https://unpkg.com/vue-amap/dist/index.js'
// 分片上传
import uploader from 'vue-simple-uploader'

Vue.config.productionTip = false
Vue.use(uploader)

new Vue({
  router,
  store,
  render: (h) => {
    Vue.prototype.$h = h
    return h(App)
  }
}).$mount('#app')
