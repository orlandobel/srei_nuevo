<template>
    <li class="list-group-item d-flex align-items-start">
        <div class="row">
            <div class="col-lg-5">{{ alumno.nombre }}</div>
            <div class="col-lg-5 text-center">{{ alumno.boleta }} </div>
            <div class="col-lg-2">
                <button class="btn btn-danger" @click="eliminar()">
                    <fa-icon :icon="['fas', 'minus']" />
                </button>
            </div>
        </div>
    </li>
</template>

<script>
export default {
    name: 'AlumnoListElement',
    props: {
        alumno: { type: Object, required: true },
        index: { type: Number, required: true },
    },
    methods: {
        eliminar() {
            this.$emit('removerAlumno', this.index)
        }
    }
}
</script>