import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from './plugins/filters'
import BootstrapVue from 'bootstrap-vue'
import users from './plugins/users'
import instruments from './plugins/instruments'
import audioInputs from './plugins/audioInputs'
import effects from './plugins/effects'
import midi from './plugins/midi'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);
Vue.use(users);
Vue.use(instruments);
Vue.use(audioInputs);
Vue.use(effects);
Vue.use(midi);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
