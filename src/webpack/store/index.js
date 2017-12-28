import Vue from 'vue';
import Vuex from 'vuex';
import state from './partial-store/state';
import mutations from './partial-store/mutations';
import getters from './partial-store/getters';
import { moduleA } from './modules/module-a';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state,
  mutations,
  getters,
  modules: {
    a: moduleA
  }
});
