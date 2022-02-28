<template>
    <li class="list-group-item align-items-start me-2">
        <div class="row">
            <div class="col-lg-7">{{ alumno.nombre }}</div>
            <div class="col-lg-4 text-center">{{ alumno.usuario }} </div>
            <div class="col-lg-1">
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
            this.$emit('remover', this.index)
        }
    }
}
</script>