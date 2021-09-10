import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueNumeric from 'vue-numeric'
import VueAxios from "vue-axios";
import axios from 'axios'

// params
axios.defaults.baseURL = process.env.VUE_APP_API_URL || ""
axios.defaults.headers.get['Content-Type'] = 'application/json; charset=utf-8'
Vue.config.productionTip = false

// Use libs
Vue.use(Buefy)
Vue.use(VueNumeric)
Vue.use(VueAxios, axios)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
