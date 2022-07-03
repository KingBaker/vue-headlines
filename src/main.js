import Vue from 'vue'
import '@/utils/console'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import { directive } from '@/utils/directive'
import 'highlight.js/styles/default.css' // 代码高亮的样式
import './VueComponents'

Vue.use(directive)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
