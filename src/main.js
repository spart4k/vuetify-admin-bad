import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
Vue.use(VueRouter);
Vue.config.productionTip = false;

import "@/assets/styles/main.scss"

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
