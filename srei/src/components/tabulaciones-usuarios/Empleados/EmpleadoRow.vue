<template>
   <tr>
        <td>{{ empleado.nombre }}</td>
        <td>{{ empleado.usuario }}</td>

        <td v-if="empleado.tipo == 2">Administrador</td>
        <td v-else>Trabajador</td>
        
        <td>{{ labPick }}</td>
        <td v-if="admin == 2"> 
            <button v-if="empleado.enEspera" class="btn btn-outline-primary">
                Admitir  <fa-icon :icon="['fas', 'plus']" />
            </button>
            <button class="btn btn-outline-danger" @click="eliminar()">
                Eliminar <fa-icon :icon="['fas', 'minus']" />
            </button>
            <button class="btn btn-outline-info">
                Cambiar tipo <fa-icon :icon="['fas', 'exchange-alt']" />
            </button>
        </td>
    </tr>
</template>

<script>
import { listaSimple } from '@/api_queries/laboratorios'

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
        eliminar(){
        }
    },
    mounted() {
        this.initData();
    }
}
</script>

<style>

</style>