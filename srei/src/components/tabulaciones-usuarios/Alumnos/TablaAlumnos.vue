<template>
    <div class="table-responsive">
        <table id="tabla-alumnos" class="table table-hover">
            <thead>
                <th scope="col">Nombre</th>
                <th scope="col">Boleta</th>
                <th scope="col">Programa academico</th>
                <th scope="col">Vetado</th>
            </thead>
            <tbody>
                <alumno-row :alumno_prop="alumno" />
            </tbody>
        </table>
    </div>
</template>

<script>
import 'jquery/dist/jquery.min.js';
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

import $ from 'jquery';
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
            alumno: {
                nombre: "ORLANDO ODISEO BELMONTE FLORES",
                usuario: "2018671281",
                programa: "INGENIERIA EN SISTEMAS COMPUTACIONALES",
                vetado: {
                    '620fe80d035e632cff086e62': true
                },
            }
        }
    },
    methods: {
        initTable() {
            this.$nextTick(() => {
                this.tabla = $('#tabla-alumnos').DataTable();
            });
        },
        async initData() {
            console.log('hey')
            /*
                TODO: llamar a la api para listar a los usuarios cuando esta exista
                cuando la api responda, llamar a initTable
            */

        },
        
    }
}
</script>