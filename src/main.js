import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./styles/index.scss";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css"; //解决编辑器的功能显示问题
Vue.use(mavonEditor);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
