<template>
    <li class="list-group-item align-items-start">
        <div class="row ">
            <div class="col-lg-4">{{ equipo.nombre }}</div>
            <div class="col-lg-2">{{ equipo.fabricante }}</div>
            <div class="col-lg-2">{{ equipo.modelo }}</div>
            <div class="col-lg-2">{{ equipo.serie }}</div>
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
    name: 'EquipoListElement',
    props: {
        equipo: { type: Object, required: true },
        index: { type: Number, required: true },
    },
    methods: {
        eliminar() {
            this.$emit('remover', this.index)
        }
    }
}
</script>