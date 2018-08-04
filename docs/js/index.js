import Vue from 'vue';
import router from './router';
import App from './app.vue';

/* eslint-disable no-unused-vars */
const app = new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
/* eslint-enable no-unused-vars */