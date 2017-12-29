import Vue from 'vue';
import App from './components/App';
import { store } from './store/index';
import { router } from './router/index';

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
