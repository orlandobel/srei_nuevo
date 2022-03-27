export default{
    namespaced: true,
    state: {
        prestamos: [],
        mesas_alumnos: [],
    },
    mutations: {
        initPrestamos: (state, prestamos) => { state.prestamos = prestamos },
        addPrestamo: (state, prestamo) => { state.prestamos.push(prestamo) },
        initAlumnos: (state, mesas_alumnos) => { state.mesas_alumnos = mesas_alumnos },
        addAlumnosMesa: (state, mesa_alumnos) => { state.mesas_alumnos.push(mesa_alumnos) },
    },
    actions: {
        initPrestamos: (context, prestamos) => { context.commit('initPrestamos', prestamos) },
        addPrestamo: (context, prestamo) => { context.commit('addPrestamo', prestamo) },
        initAlumnos: (context, mesas_alumnos) => { context.commit('initAlumnos', mesas_alumnos) },
        addAlumnosMesa: (context, mesa_alumnos) => { context.commit('addAlumnosMesa', mesa_alumnos) },
    },
    getters: {
        prestamos: (state) => state.prestamos,
        mesas_alumnos: (state) => state.mesas_alumnos,
    }
}