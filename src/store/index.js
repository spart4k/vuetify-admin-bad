import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import alert from "./alert";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {auth, alert},
});
