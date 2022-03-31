<template>
  <div class="table-responsive">
        <table id="tabla_empleados" class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">RFC</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Laboratorio</th>
                    <th v-if="admin == 2" scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <empleado-row v-for="empleado in empleados" :key="empleado._id" :empleado_prop="empleado" :admin_prop="admin" @datoEliminado="initData()" @error="show_error($event)" />
            </tbody>
            <tfoot>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">RFC</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Laboratorio</th>
                    <th v-if="admin == 2" scope="col">Acciones</th>
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
import { listarEmpleados } from '@/api_queries/usuarios';
import EmpleadoRow from '@/components/tabulaciones-usuarios/Empleados/EmpleadoRow.vue';

export default {
    name: 'TablaEmpleados',
    components:{
        EmpleadoRow,
    },
   
    data() {
        return {
            admin: this.$store.getters.usuario.tipo,
            tabla: null,
            empleados: [],
        }
    },
    methods: {
        initTable() {
            this.$nextTick(() => {
                this.tabla = $('#tabla_empleados').DataTable();
            });
        },
        async initData() {
            try {
                this.empleados = await listarEmpleados();
                console.log(this.empleados)
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

<style>

</style>