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
import { faAngleDown, faBolt, faBook, faCogs, faList, faMicrochip, faMinus, faPen, faPlus, faExchangeAlt, faQrcode, faSearch, faTrash, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

axios.defaults.baseURL = 'http://148.204.142.162:4041/API_SREI/'
//axios.defaults.baseURL = 'http://localhost:3000/API_SREI'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('usr_token')

library.add(
    faQrcode,
    faUserPlus,
    faSearch,
    faMinus,
    faPlus,
    faExchangeAlt,
    faList,
    faBook,
    faMicrochip,
    faCogs,
    faBolt,
    faAngleDown,
    faPen,
    faTrash,
    faUsers,
)

createApp(App)
    .use(store)
    .use(router)
    .use(VueAxios, axios)
    .component('fa-icon', FontAwesomeIcon)
    .mount('#app')
