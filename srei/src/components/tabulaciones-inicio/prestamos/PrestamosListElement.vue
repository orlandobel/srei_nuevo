<template>
    <li class="list-group-item d-flex justify-content-between align-items-start">
        {{elemento.nombre}} 
        <div v-if="elemento.boleta != null || elemento.boleta != undefined" >
            <span class="me-4"> |&emsp; {{boleta}}</span>
            <fa-icon :icon="['fas', 'minus']" />
        </div>
        <div v-if="elemento.fabricante != null || elemento.fabricante != undefined">
            |&emsp; <b>Fabricante: </b> {{ elemento.fabricante }}
        </div>
        <div v-if="elemento.modelo != null || elemento.modelo != undefined">
            |&emsp; <b>Modelo: </b> {{ elemento.modelo }}
        </div>
        <div v-if="elemento.serie != null || elemento.serie != undefined">
            |&emsp; <b>No. de serie: </b> {{ elemento.serie }}
        </div>
    </li>
</template>

<script>
export default {
    name: 'PrestamosListElement',
    props: {
        elemento: { type: Object, required: false },
        nombre: { type: String, required: true },
        boleta: { type: String, required: false },
        id:     { type: String, required: false }
    },
    mounted() {
        console.log(this.elemento)
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

div.hideAndSeek {
    display: none !important;
}

</style>