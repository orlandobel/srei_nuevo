<template>
    <li class="list-group-item d-flex align-items-start">
        <ul class="list-group list-group-horizontal w-100">
            <li class="list-group-item w-100 border-0 border-end">{{alumno.nombre}}</li>
            <li class="list-group-item w-100 border-0 border-end">{{alumno.usuario}}</li>
            <li class="list-group-item w-100 border-0 border-end">{{alumno.programa}}</li>
            <!--li class="list-group-item w-100 border-0 border-end">{{mesa}}</li>
            <li class="list-group-item w-100 border-0">{{hora}}</li>
            <li class="list-group-item w-100 border-0" v-bind:class="{'border-start':encargado}">
                <span v-if="encargado === true" class="border-start"> Encargado de equipo</span>
            </li-->
        </ul>
    </li>
</template>

<script>
export default {
    name: 'AlumnosLaboratorioListElement',
    props: {
        alumno: { type: Object, required: true},
    }
}
</script>