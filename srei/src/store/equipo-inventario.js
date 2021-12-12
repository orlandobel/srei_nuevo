export default {
    namespaced: true,
    state: {
        nombre: '',
        caracteristicas: {
            fabricante: '',
            modelo: '',
            serie: '',
            descripcion: '',
        },
        hasChecklist: false,
        checklist: {},
    }
}
