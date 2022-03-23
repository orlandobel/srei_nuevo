<template>
    <tr>
        <td>{{ alumno.nombre }}</td>
        <td>{{ alumno.usuario }}</td>
        <td>{{ alumno.programa }}</td>
        <td >
            <div class="fomr-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" 
                    ref="vetado_btn"
                    :checked="vetado" @change="toggleVetado()" />
            </div>
        </td>
    </tr>
</template>

<script>
import { cambiarVetado } from '@/api_queries/usuarios';

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
            if(!Object.keys(this.alumno).includes('vetado'))
                return false;

            return this.alumno.vetado[this.laboratorio._id] || false
        }
    },
    methods: {
        toggleVetado() {
            // TODO: llamar a la api para cambiar el vetado cuando exista
            // Si la api responde con un error forzar el estado previo con:
            // this.$refs.vetado_btn.checked = <estado previo>;
            cambiarVetado(this.alumno._id, this.laboratorio._id, !this.vetado).then(res => {
                console.log("Alumno actualizado");
                this.alumno = res;
            }).catch(error => {
                console.log(error);
                this.$refs.vetado_btn.checked = this.vetado;
            })
        }
    },
}
</script>