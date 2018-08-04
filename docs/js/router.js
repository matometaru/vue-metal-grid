import Vue from 'vue';
/* eslint-disable import/no-extraneous-dependencies */
import VueRouter from 'vue-router';
/* eslint-enable import/no-extraneous-dependencies */
import Home from './pages/Home';
import Template from './pages/Template.vue';
import Photo from './pages/Photo.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', component: Home, props: true },
    { path: '/template', component: Template, props: true },
    { path: '/photo', component: Photo, props: true },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});