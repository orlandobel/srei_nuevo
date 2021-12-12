import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "bootstrap/dist/css/bootstrap.min.css"
//import "bootstrap/dist/js/bootstrap"
import "bootstrap"

import axios from 'axios'
import VueAxios from 'vue-axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown, faBolt, faBook, faCogs, faList, faMicrochip, faMinus, faQrcode, faSearch, faUserPlus }from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

axios.defaults.baseURL = 'http://localhost:3001/API_SREI/'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('usr_token')

library.add(
    faQrcode,
    faUserPlus,
    faSearch,
    faMinus,
    faList,
    faBook,
    faMicrochip,
    faCogs,
    faBolt,
    faAngleDown
)

createApp(App)
    .use(store)
    .use(router)
    .use(VueAxios, axios)
    .component('fa-icon', FontAwesomeIcon)
    .mount('#app')
