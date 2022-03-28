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
        removerAlumnosMesa: (state, mesa_alumnos) => {
            const index = state.mesas_alumnos.findIndex(e => e.nombre = mesa_alumnos);
            state.mesas_alumnos.splice(index, 1);
        },
    },
    actions: {
        initPrestamos: (context, prestamos) => { context.commit('initPrestamos', prestamos) },
        addPrestamo: (context, prestamo) => { context.commit('addPrestamo', prestamo) },
        initAlumnos: (context, mesas_alumnos) => { context.commit('initAlumnos', mesas_alumnos) },
        addAlumnosMesa: (context, mesa_alumnos) => { context.commit('addAlumnosMesa', mesa_alumnos) },
        removerAlumnosMesa: (context, mesa_alumnos) => { context.commit('removerAlumnosMesa', mesa_alumnos) },
    },
    getters: {
        prestamos: (state) => state.prestamos,
        mesas_alumnos: (state) => state.mesas_alumnos,
    }
}