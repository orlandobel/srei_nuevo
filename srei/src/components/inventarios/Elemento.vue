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
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#equipoModal">Info</button>
        </td>
    </tr>
</template>

<script>
export default {
    name: 'Elemento',
    props: {
        equipo_bind: { type: Object, required: true }
    },
    data() {
        return {
            equipo: this.equipo_bind
        }
    }
}
</script>