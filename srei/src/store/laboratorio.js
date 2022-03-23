export default{
    namespaced: true,
    state: {
        prestamos: [],
        mesas_alumnos: [],
    },
    mutations: {
        initPrestamos: (state, prestamos) => { state.prestamos = prestamos },
        addPrestamo: (state, prestamo) => { state.prestamos.append(prestamo) },
        initAlumnos: (state, mesas_alumnos) => { state.mesas_alumnos = mesas_alumnos },
    },
    actions: {
        initPrestamos: (context, prestamos) => { context.commit('initPrestamos', prestamos) },
        addPrestamo: (context, prestamo) => { context.commit('addPrestamo', prestamo) },
        initAlumnos: (context, mesas_alumnos) => { context.commit('initAlumnos', mesas_alumnos) },
    },
    getters: {
        prestamos: (state) => state.prestamos,
        mesas_alumnos: (state) => state.mesas_alumnos,
    }
}