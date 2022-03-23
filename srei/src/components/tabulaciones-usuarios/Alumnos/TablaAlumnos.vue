<template>
    <div class="table-responsive">
        <table id="tabla_alumnos" class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Boleta</th>
                    <th scope="col">Programa academico</th>
                    <th scope="col">Vetado</th>
                </tr>
            </thead>
            <tbody>
                <alumno-row v-for="alumno in alumnos" :key="alumno._id" :alumno_prop="alumno" @error="show_error($event)"/>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Boleta</th>
                    <th scope="col">Programa academico</th>
                    <th scope="col">Vetado</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import 'jquery/dist/jquery.min.js'
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

import $ from 'jquery';
import { listarAlumnos } from '@/api_queries/usuarios';

import AlumnoRow from '@/components/tabulaciones-usuarios/Alumnos/AlumnoRow.vue';

export default {
    name: 'TablaAlumnos',
    components:{
        AlumnoRow,
    },
    data() {
        return {
            tabla: null,
            alumnos: [],
        }
    },
    methods: {
        initTable() {
            this.$nextTick(() => {
                this.tabla = $('#tabla_alumnos').DataTable();
            });
        },
        async initData() {
            try {
                this.alumnos = await listarAlumnos();
                this.initTable();
            } catch(error) {
                console.error(error);
            }

        },
        show_error(error) {
            this.$emit('error', error);
        }
    },
    mounted() {
        this.initData();
    }
}
</script>