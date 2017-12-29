import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './partial-router/routes';

Vue.use(VueRouter);

export const router = new VueRouter({
  routes
});
