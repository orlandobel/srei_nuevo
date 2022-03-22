<template>
    <tr>
        <td>ORLANDO ODISEO BELMONTE FLORES</td>
        <td>2018671281</td>
        <td>INGENIERIA EN SISTEMAS COMPUTACIONALES</td>
        <td >
            <div class="fomr-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" 
                    ref="vetado_btn"
                    checked="vetado" @change="toggleVetado()" />

                    {{ vetado }}
            </div>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'AlumnoRow',
    props: {
        alumno_prop: { type: Object, required: true }
    },
    data() {
        return {
            alumno: this.alumno_prop,
            laboratorio: this.$store.getters.laboratorio,
        }
    },
    computed: {
        vetado() {
            return this.alumno.vetado[this.laboratorio._id] || false
        }
    },
    methods: {
        toggleVetado() {
            // TODO: llamar a la api para cambiar el vetado cuando exista
            // Si la api responde con un error forzar el estado previo con:
            // this.$refs.vetado_btn.checked = <estado previo>;
            this.alumno.vetado['620fe80d035e632cff086e62'] = !this.vetado;
        }
    },
}
</script>