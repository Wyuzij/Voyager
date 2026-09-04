import App from './App'
import { createSSRApp } from 'vue'
// #ifndef H5
import uviewPlus from '@/uni_modules/uview-plus'
// #endif
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

export function createApp() {
  const app = createSSRApp(App)
  // #ifndef H5
  app.use(uviewPlus)
  // #endif
  return {
    app
  }
}