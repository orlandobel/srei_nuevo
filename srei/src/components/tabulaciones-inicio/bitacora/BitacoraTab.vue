<template>
    <div class="row overflow-hidden">
        <div class="col-lg-12">
            <!-- Cabezera de la sección -->
            <div class="row header pd-1">
                <div class="col-9 d-flex">
                    <b class="h3 align-self-center fw-bolder me-4">Bitácora de prestamos del día</b>
                </div>
            </div>
            <!-- Fin de la cabezera -->

            <!-- Lista de de la bitácora -->
            <div class="row list-wrapper">
                <div class="col-12 py-2 px-2 h-100 mh-100">
                    <ul class="list-group list-group-flush p-2 border border-dark rounded-3 h-100 mh-100 overflow-auto">
                        <li class="list-group-item d-flex align-items-start">
                            <ul class="list-group list-group-horizontal w-100 fw-bold">
                                <li class="list-group-item w-25 border-0 border-end"
                                    v-if="laboratorio.nombre.includes('Electronica')">Mesa</li>
                                <li class="list-group-item w-25 border-0 border-end">No. alumnos</li>
                                <li class="list-group-item w-25 border-0 border-end">No. materiales</li>
                                <li class="list-group-item w-25 border-0 border-end">Hora de prestamo</li>
                                <li class="list-group-item w-25 border-0 border-end">Hora de devolución</li>
                                <li class="list-group-item w-25 border-0">Equipo</li>
                            </ul>
                        </li>
                        <bitacora-item v-for="(prestamo, index) in prestamos" :key="prestamo._id" 
                            :prestamo_prop="prestamo" :index="index" @error="errorPrestamo($event)"/>
                    </ul>
                </div>
            </div>
            <!-- Fin de la bitácora -->
        </div>
    </div>
</template>

<script>
import BitacoraItem from '@/components/tabulaciones-inicio/bitacora/BitacoraItem.vue';
import { prestamosDia } from '@/api_queries/prestamos.js';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'BitacoraTab',
    components: {
        BitacoraItem,
    },
    data() {
        return {
            laboratorio: this.$store.getters.laboratorio,
        }
    },
    computed: {
        ...mapGetters('laboratorio_store', ['prestamos']),
    },
    methods: {
        ...mapActions('laboratorio_store', ['initPrestamos']),
        errorPrestamo(error) {
            this.$emit('error', error);
        }
    },
    mounted() {
        prestamosDia(this.laboratorio._id).then(res => {
            this.initPrestamos(res.prestamos)
        }).catch(error => this.$emit('error', error));
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.list-wrapper {
    --height: 20.6cm;
}

@media screen and ( max-height: 1080px) {
    .list-wrapper {
        --height: 19.8cm;
    }
}

.list-wrapper {
    height: var(--height);
    max-height: var(--height);
}

.alumnos-wrapper {
    height: 19.1cm;
    max-height: 19.1cm;
}

.icon-button {
    padding: 1px 5px;
}

.header {
    height: 5%;
    max-height: 5%;
}
</style>