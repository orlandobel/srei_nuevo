<template>
   <tr>
        <td>{{ empleado.nombre }}</td>
        <td>{{ empleado.usuario }}</td>

        <td v-if="empleado.tipo == 2">Administrador</td>
        <td v-else>Trabajador</td>
        
        <td>{{ labPick }}</td>
        <td v-if="admin == 2"> 
            <button v-if="empleado.enEspera" class="btn btn-outline-primary" @click="agregar()">
                Admitir  <fa-icon :icon="['fas', 'plus']" />
            </button>
            <button class="btn btn-outline-danger" @click="eliminar()">
                Eliminar <fa-icon :icon="['fas', 'minus']" />
            </button>
            <button class="btn btn-outline-info" @click="toggleType()">
                Cambiar tipo <fa-icon :icon="['fas', 'exchange-alt']"/>
            </button>
        </td>
    </tr>
</template>

<script>
import { listaSimple } from '@/api_queries/laboratorios'
import { toggleTipo, aceptar, eliminarEmpleado } from '@/api_queries/usuarios'

export default {
    name: 'EmpleadoRow',
    props: {
        empleado_prop: { type: Object, required: true },
        admin_prop: {type: Number, required: true}
    },
    data() {
        return {
            empleado: this.empleado_prop,
            admin: this.admin_prop,
            laboratorio: this.$store.getters.laboratorio,
            labPick:""
        }
    },
    methods: {
        async initData(){
            const listLabs = await listaSimple();
            listLabs.forEach(lab => {
                if(lab._id == this.empleado.laboratorio){
                    this.labPick = lab.nombre
                } 
            });
            
        },
        async agregar(){
            //aqui se hara el toggle de en espera en false
            const idEmpleado = this.empleado._id;
            const wop = await aceptar(idEmpleado)
            this.empleado = wop
            this.initData() 

        },
        async eliminar(){
            //aqui se eliminará el registro de usuario eliminarEmpleado
            const idEmpleado = this.empleado._id;
            const eliminado = await eliminarEmpleado(idEmpleado)
            if (eliminado)
                this.$emit('datoEliminado')
            
        },
        async toggleType(){
            const idEmpleado = this.empleado._id;
            const wop = await toggleTipo(idEmpleado, this.empleado.tipo)
            this.empleado = wop
            this.initData() 
        }
    },
    mounted() {
        this.initData();
    }
}
</script>

<style>

</style>