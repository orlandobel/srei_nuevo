export default{
    namespaced: true,
    state: {
        nombre: '',
        caracteristicas: {
            fabricante: '',
            modelo: '',
            serie: '',
            descripcion: '',
        },
        tiene_checklist: false,
        checklist: [],
    },
    mutations: {
        // Mutaciónes del nombre
        nombre: (state, nombre) => { state.nombre = nombre },

        // Mutaciónes de caracteristicas
        fabricante: (state, fabricante) => { state.caracteristicas.fabricante = fabricante },
        modelo: (state, modelo) => { state.caracteristicas.modelo = modelo },
        serie: (state, serie) => { state.caracteristicas.serie = serie },
        descripcion: (state, descripcion) => { state.caracteristicas.descripcion = descripcion },
        caracteristicas: (state, caracteristicas) => { state.caracteristicas = caracteristicas },

        // Mutaciones de checklist
        toggle_checklist: (state, existe) => { state.tiene_checklist = existe; },
        add_checklist_element: (state) => { state.checklist.push({nombre: '', estatus: true})},
        remove_checklist_elements: (state, {start, end}) => { state.checklist.splice(start, end) },
        set_checklist: (state, checklist) => { state.checklist = checklist },
    },
    actions: {
        // Acciones del nombre
        set_nombre: (context, nombre) => { context.commit('nombre', nombre) },

        // Acciones de caracteristicas
        set_fabricante: (context, fabricante) => { context.commit('fabricante', fabricante) },
        set_modelo: (context, modelo) => { context.commit('modelo', modelo) },
        set_serie: (context, serie) => { context.commit('serie', serie) },
        set_descripcion: (context, descripcion) => { context.commit('descripcion', descripcion) },
        set_caracteristicas: (context, caracteristicas) => { context.commit('caracteristicas', caracteristicas) },

        // Acciones de checklist
        toggle_checklist: (context, existe) => { context.commit('toggle_checklist', existe) },
        add_checklist_element: (context) => { context.commit('add_checklist_element') },
        remove_checklist_elements: (context, {start, end}) => { context.commit('remove_checklist_elements', { start, end }) },
        set_checklist: (context, checklist) => { context.commit('set_checklist', checklist) },
    },
    getters: {
        nombre: (state) => state.nombre,
        caracteristicas: (state) => state.caracteristicas,
        tiene_checklist: (state) => state.tiene_checklist,
        checklist: (state) => state.checklist,
    },
};
