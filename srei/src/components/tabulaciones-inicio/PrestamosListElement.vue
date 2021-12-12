<template>
    <li class="list-group-item d-flex justify-content-between align-items-start">
        {{nombre}} 
        <div>
            <span v-if="boleta !== ''" class="me-4"> |&emsp; {{boleta}}</span>
        <fa-icon :icon="['fas', 'minus']" />
        </div>
    </li>
</template>

<script>
export default {
    name: 'PrestamosListElement',
    props: {
        nombre: { type: String, required: true },
        boleta: { type: String, required: false, default: '' },
    },
}
</script>