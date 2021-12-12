<template>
    <li class="list-group-item d-flex align-items-start">
        <ul class="list-group list-group-horizontal w-100">
            <li class="list-group-item w-100 border-0 border-end">{{nombre}}</li>
            <li class="list-group-item w-100 border-0 border-end">{{boleta}}</li>
            <li class="list-group-item w-100 border-0 border-end">{{mesa}}</li>
            <li class="list-group-item w-100 border-0">{{hora}}</li>
            <li class="list-group-item w-100 border-0" v-bind:class="{'border-start':encargado}">
                <span v-if="encargado === true" class="border-start"> Encargado de equipo</span>
            </li>
        </ul>
    </li>
</template>

<script>
export default {
    name: 'AlumnosLaboratorioListElement',
    props: {
        nombre: { type: String, required: true },
        boleta: { type: String, required: true },
        mesa: { type: String, required: true },
        hora: { type: String, required: true },
        encargado: { type: Boolean, required: false, default: false}
    }
}
</script>