<template>
    <div class="table-responsive">
        <table id="inventario" class="table table-bordered table-hover">
            <thead>
                <tr>
                    <th scope="col" class="col-5">Nombre</th>
                    <th scope="col" class="col-2">Modelo</th>
                    <th scope="col" class="col-2">Fabricante</th>
                    <th scope="col" >No. de serie</th>
                    <th scope="col" >Disponibilidad</th>
                    <th scope="col" >Acciones</th>
                </tr>
            </thead>
            <tbody>
                <elemento v-for="(e, index) in equipos" :key="e.id" :equipo_bind="e" :index="index" 
                    v-on:eliminado="remover($event)" v-on:error_eliminar="error_eliminar()"/>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="col">Nombre</th> 
                    <th scope="col">Modelo</th>
                    <th scope="col">Fabricante</th>
                    <th scope="col">No. de serie</th>
                    <th scope="col">Disponibilidad</th>
                    <th scope="col">Editar</th>
                </tr>
            </tfoot>
        </table> 
    </div>
</template>

<script>
import 'jquery/dist/jquery.min.js'
import 'datatables.net-bs5/js/dataTables.bootstrap5.min.js'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

import $ from 'jquery'
import Elemento from '@/components/inventarios/Elemento.vue'

import { listar } from '@/api_queries/equipo'

export default {
    name: 'Datatable',
    components: {Elemento, },
    data() {
        return {
            inventario: null,
            equipos: [],
        }
    },
    computed: {
        usuario: function() {
            return this.$store.getters.usuario
        },
    },
    watch: {
        // call method if the route changes
        '$route': 'reInitialize'
    },
    methods: {
        initTable() {
            this.$nextTick(() => { this.inventario = $('#inventario').DataTable() })
        },
        initData() {
            const tipo = this.$route.params.tipo

            listar(tipo, this.usuario.laboratorio).then(res => {
                this.equipos = res
                this.initTable()
            })
        },
        reInitialize() {
            this.equipos = []
            this.inventario.destroy()
            this.initData()
        },
        remover(index) {
            console.log(index)
            this.equipos.splice(index, 1)

            this.$emit('removido', true)
        },
        error_eliminar() {
            this.$emit('removido', false)
        },
        agregar(eqp) {
            this.equipos.push(eqp)
            
            this.inventario.destroy()
            this.initData()
        },
        actualizar_equipo(eqp) {
            const index = this.equipos.findIndex(element => element.id === eqp.id)
            this.equipos[index] = eqp
        }
    },
    mounted() {
        this.initData()
    },
}
</script>