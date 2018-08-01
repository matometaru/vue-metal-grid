import Vue from 'vue'
import router from './router.js'

const app = new Vue({
  el: '#app',
  router,
  created () {
  },
  render: h => h(require('./app.vue')),
})