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
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#equipoModal" @click="set_element">Info</button>
        </td>
    </tr>
</template>

<script>
import { mapActions } from 'vuex'

const actions = [
    'set_nombre',
    'set_caracteristicas',
    'toggle_checklist',
    'set_checklist',
]

export default {
    name: 'Elemento',
    props: {
        equipo_bind: { type: Object, required: true }
    },
    data() {
        return {
            equipo: this.equipo_bind
        }
    },
    methods: {
        ...mapActions('equipo_inventario', actions),
        set_element() {
            this.set_nombre(this.equipo.nombre),
            this.set_caracteristicas(this.equipo.caracteristicas)

            if(Object.keys(this.equipo).includes('checklist')) {
                console.log(this.equipo.checklist)
                this.set_checklist(this.equipo.checklist)
                this.toggle_checklist(true)
            }
        }
    }
}
</script>