import { createStore } from 'vuex';
import equipo_inventario from './equipo_inventario';
import laboratorio_store from './laboratorio';

export default createStore({
  state: {
    usuario: null,
    laboratorio: null,
    nextPath: '/',
  },
  mutations: {
    nextPath(state, path) {
      state.nextPath = path
    },
    usuario(state, usr) {
      state.usuario = usr
    },
    laboratorio(state, lab) {
      state.laboratorio = lab
    }
  },
  actions: {
    nextPath(context, path) {
      context.commit('nextPath', path)
    },
    usuario(context, usr) { 
      context.commit('usuario', usr)
    },
    laboratorio(context, lab) {
      context.commit('laboratorio', lab)
    }
  },
  getters: {
    nextPath: (state) => state.nextPath,
    usuario: (state) => state.usuario,
    laboratorio: (state) => state.laboratorio
  },
  modules: {
    equipo_inventario,
    laboratorio_store,
  }
})
