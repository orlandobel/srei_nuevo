<template>
    <div class="row overflow-hidden">
        <div class="col-lg-12">
            <!-- Cabezera de la sección -->
            <div class="row header pd-1">
                <div class="col-9 d-flex">
                    <b class="h3 align-self-center fw-bolder me-4">Alumnos en el laboratorio</b>
                </div>
            </div>
            <!-- Fin de la cabezera -->

            <!-- Lista de los alumnos que están haciendo uso de los laboratorios -->
            <div class="row list-wrapper">
                <div class="col-12 py-2 px-2 h-100 mh-100">
                    <div class="px-3 border border-dark rounded-3 h-100 mh-100 overflow-auto">
                        <div class="row px-3 pt-3" v-for="mesa in mesas_alumnos" :key="mesa._id">
                            <div class="col-12">
                                <div class="row px-3 border-bottom border-dark fs-5 fw-bold">
                                    {{ mesa.nombre }}
                                </div>
                                <div class="row">
                                    <ul class="list-group list-group-flush">
                                        <alumnos-laboratorio-list-element v-for="alumno in mesa.alumnos" :key="alumno._id" :alumno="alumno"/>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Fin de la lista -->
        </div>
    </div>
</template>

<script>
import AlumnosLaboratorioListElement from '@/components/tabulaciones-inicio/alumnos_laboratorio/AlumnosLaboratorioListElement.vue'
import { listarAlumnosMesa } from '@/api_queries/laboratorios';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'AlumnosLaboratorioTab',
    components: { 
        AlumnosLaboratorioListElement,
    },
    computed: {
        ...mapGetters('laboratorio_store', ['mesas_alumnos']),
    },
    methods: {
        ...mapActions('laboratorio_store', ['initAlumnos']),
        async initView() {
            const laboratorio = this.$store.getters.laboratorio._id;
            const mesas = await listarAlumnosMesa(laboratorio);
            this.initAlumnos(mesas);
        }
    },
    mounted() {
        this.initView();
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.list-wrapper {
    height: 20.6cm;
    max-height: 20.6cm;
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