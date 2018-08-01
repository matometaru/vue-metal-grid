import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

export default new VueRouter({
    // mode: 'abstract',
    mode: 'history',
    routes: [
        { path: '/', component: require('./pages/Home').default, props: true },
        { path: '/template', component: require('./pages/Template.vue'), props: true },
        { path: '/photo', component: require('./pages/Photo.vue'), props: true  },
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
})