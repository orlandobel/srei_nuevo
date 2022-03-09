<template>
    <li class="list-group-item d-flex align-items-start">
        <ul class="list-group list-group-horizontal w-100">
            <li class="list-group-item w-100 border-0 border-end">{{ nombre }}</li>
            <li class="list-group-item w-50 border-0 border-end">{{ boleta }}</li>
            <li class="list-group-item w-25 border-0 border-end">{{ mesa }}</li>
            <li class="list-group-item w-50 border-0 border-end">{{ prestamo }}</li>
            <li class="list-group-item w-50 border-0 border-end">{{ devolucion }}</li>
            <li class="list-group-item w-50 border-0">
                <button class="btn btn-primary" v-bind:class="{disabled: entregado}">Entregar</button>
            </li>
        </ul>
    </li>
</template>

<script>
export default {
    name: 'BitacoraItem',
    props: {
        nombre: { type: String, required: true },
        boleta: { type: String, required: true },
        mesa: { type: String, required: true },
        prestamo: { type: String, required: true },
        devolucion: { type: String, required: false, default: '' },
        entregado: { type: Boolean, required: false, default: false },
    }
}
</script>