import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3001/API_SREI/'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = localStorage.getItem('usr_token')