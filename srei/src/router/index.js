import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import SingUp from '@/views/SignUp.vue'
import Inventario from '@/views/Inventarios.vue'
import Catalogos from '@/views/Catalogos.vue'
import Usuarios from '@/views/Usuarios.vue'
import CatalogosViewer from '@/components/catalogos/CatalogosViewer.vue'
import Perfil from '@/views/Perfil.vue';
import RecuperarClave from '@/views/RecuperarClave.vue';
import ClaveOlvidada from '@/views/ClaveOlvidada.vue';

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
    path: '/clave-olvidada',
    name: 'clave_olvidada',
    component: ClaveOlvidada,
  },
  {
    path: '/recuperar-clave/:token',
    name: 'recuperar_clave',
    component: RecuperarClave,
  },
  {
    path: '/profile',
    name: 'perfil',
    component: Perfil,
    meta: {
      needLoggin: true,
    }
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
    path: '/usuarios',
    name: 'usuarios',
    component: Usuarios,
    meta: {
      needLoggin: true
    }
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
  if(to.matched.some(record => record.meta.needLoggin)) isLogged({to, next, store})
  else next()
});

export default router
