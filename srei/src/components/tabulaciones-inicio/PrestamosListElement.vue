<template>
    <li class="list-group-item d-flex justify-content-between align-items-start">
        {{nombre}} 
        <div v-if="boleta !== ''" >
            <span class="me-4"> |&emsp; {{boleta}}</span>
            <fa-icon :icon="['fas', 'minus']" />
        </div>
        <div v-if="id !== ''" class="hideAndSeek" :name ="id">
            {{id}}
        </div>
    </li>
</template>

<script>
export default {
    name: 'PrestamosListElement',
    props: {
        nombre: { type: String, required: true },
        boleta: { type: String, required: false, default: '' },
        id:     { type: String, required: false, default: '' }
    },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

div.hideAndSeek {
    display: none !important;
}

</style>