import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import SingUp from '@/views/SignUp.vue'
import Inventario from '@/views/Inventarios.vue'
import Catalogos from '@/views/Catalogos.vue'
import CatalogosViewer from '@/components/catalogos/CatalogosViewer.vue'

import isLogged from './middleware/auth';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'bitacora',
    meta: {
      needLoggin: true,
    },
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SingUp,
  },
  {
    path: '/inventario/:tipo',
    name: 'inventario',
    component: Inventario,
    beforeRouteUpdate (to, from, next) {
      console.log("Updating route")
    },
    meta: {
      needLoggin: true,
    },
  },
  {
    path: '/catalogos',
    name: 'catalogos',
    component: Catalogos,
    meta: {
      needLoggin: true,
    },
  },
  {
    path: '/catalogos/:laboratorio/:tipo',
    name: 'catalogosPDF',
    component: CatalogosViewer,
    meta: {
      needLoggin: true,
    },
  },


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to)
  if(to.matched.some(record => record.meta.needLoggin)) isLogged({to, next, store})
  else next()
})

/*router.beforeEach = async (to, from, next) => {
  if(to.matched.some(record => record.meta.needLoggin)) {
    await isLogged({to, next})
  } else { next() }
}*/

export default router
