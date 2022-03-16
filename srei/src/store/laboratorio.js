export default{
    namespaced: true,
    state: {
        prestamos: [],
    },
    mutations: {
        initPrestamos: (state, prestamos) => { state.prestamos = prestamos },
        addPrestamo: (state, prestamo) => { state.prestamos.append(prestamo) },
    },
    actions: {
        initPrestamos: (context, prestamos) => { context.commit('initPrestamos', prestamos) },
        addPrestamo: (context, prestamo) => { context.commit('addPrestamo', prestamo) },
    },
    getters: {
        prestamos: (state) => state.prestamos,
    }
}