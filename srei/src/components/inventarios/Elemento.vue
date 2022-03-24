<template>
    <tr>
        <td>{{ equipo.nombre }}</td>
        <td>{{ equipo.caracteristicas.modelo }}</td>
        <td>{{ equipo.caracteristicas.fabricante }}</td>
        <td>{{ equipo.caracteristicas.serie }}</td>
        <td>
            <span v-if="equipo.disponible">Disponible</span>
            <span v-else>Ocupado</span>
        </td>
        <td>
            <table>
                <tr >
                    <td class="btn-cell">
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#equipoModal" @click="set_element">
                            <fa-icon :icon="['fas', 'pen']" />
                        </button>
                    </td>
                    <td class="btn-cell">
                        <button class="btn btn-danger" @click="consulta_eliminar">
                            <fa-icon :icon="['fas', 'trash']" />
                        </button>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</template>

<script>
import { mapActions } from 'vuex'
import { imagen, eliminar } from '@/api_queries/equipo'

const actions = [
    'set_id',
    'set_nombre',
    'set_imagen_src',
    'set_caracteristicas',
    'toggle_checklist',
    'set_checklist',
    'set_creacion',
]

export default {
    name: 'Elemento',
    props: {
        equipo_bind: { type: Object, required: true },
        index: { type: Number, required: true }
    },
    data() {
        return {
            equipo: this.equipo_bind,
            campos: Object.keys(this.equipo_bind),
        }
    },
    methods: {
        ...mapActions('equipo_inventario', actions),
        set_element() {
            this.set_id(this.equipo._id)
            this.set_nombre(this.equipo.nombre)
            this.set_caracteristicas(this.equipo.caracteristicas)
            this.set_creacion(false)

            if(this.campos.includes('checklist')) {
                console.log(Object.values(this.equipo.checklist))
                this.set_checklist(Object.values(this.equipo.checklist))
                this.toggle_checklist(true)
            }

            if(this.campos.includes('img_path')) {
                console.info('Cambiando path')
                this.set_imagen_src(this.equipo.img_path)
            }
        },
        consulta_eliminar() {
            eliminar(this.equipo.path)
                .then(result => {
                    console.log(result);

                    if(result) {
                        this.$emit('eliminado', this.index)
                    } else {
                        console.log('error al eliminar')
                        this.$emit('error_eliminar')
                    }
                })
                .catch(() => {
                    console.log('error al eliminar')
                    this.$emit('error_eliminar')
                })
        },
        async buscarImagen() {
            if(this.equipo.path != null && this.equipo.path != undefined) {
                const res = await imagen(this.equipo.path);
                if(res === null || res === undefined || res === '')
                    return;

                this.equipo.img_path = `data:image/png;base64,${res}`;
                this.campos = Object.keys(this.equipo);
            }
        }
    },
    mounted() {
        this.buscarImagen();
    }
}
</script>

<style lang="scss" scoped>
.btn-cell {
    border: none;
}
</style>