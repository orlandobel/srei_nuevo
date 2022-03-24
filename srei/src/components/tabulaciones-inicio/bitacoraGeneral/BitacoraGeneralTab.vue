<template>
    <div class="row overflow-hidden">
        <div class="col-lg-12">
            <!-- Cabezera de la sección -->
            <div class="row header pd-1">
                <div class="col-7 d-flex">
                    <b class="h3 align-self-center fw-bolder me-4">Bitácora periodica de prestamos</b>
                </div>
                <div class="col-2">
                    <label for="dateI" >Fecha Inicial</label>
                    <input id="dateI" type="date" class="border-0" v-model="this.fechaI"/>
                </div>
                <div class="col-2">    
                    <label for="dateO">Fecha Final</label>
                    <input id="dateO" type="date" class="border-0" v-model="this.fechaO"/>
                </div>
                <div v-if="this.fechaI != '' && this.fechaO != ''" class="col-1">   
                    <button class="btn btn-primary" v-on:click="this.wop() ">Buscar</button>
                </div>

            </div>
            <!-- Fin de la cabezera -->

            <!-- Lista de de la bitácora -->
            <div class="row list-wrapper">
                <div class="col-12 pt-2 px-2 h-100 mh-100">
                    <ul class="list-group list-group-flush p-2 border border-dark rounded-3 h-100 mh-100 overflow-auto">
                        <li class="list-group-item d-flex align-items-start">
                            <ul class="list-group list-group-horizontal w-100 fw-bold">
                                <li class="list-group-item w-100 border-0 border-end">Nombre y boleta</li>
                                <li class="list-group-item w-25 border-0 border-end">Mesa</li>
                                <li class="list-group-item w-50 border-0 border-end">Fecha de prestamo</li>
                                <li class="list-group-item w-50 border-0 border-end">Hora de prestamo</li>
                                <li class="list-group-item w-50 border-0 border-end">Hora de devolución</li>
                                <li class="list-group-item w-50 border-0">Acciones</li>
                            </ul>
                        </li>
                        <bitacora-general-item 
                            v-for="prestamo in consult" :key="prestamo._id" 
                            :alumnos="prestamo.alumnos" :mesa="prestamo.mesa" :fecha="prestamo.creado" :prestamo="prestamo.actualizado" :equipos="prestamo.equipo" :activo="prestamo.activo"/>
                    </ul>
                </div>
            </div>
            <!-- Fin de la bitácora -->
        </div>
    </div>
</template>

<script>
import BitacoraGeneralItem from '@/components/tabulaciones-inicio/bitacoraGeneral/BitacoraGeneralItem.vue'
import { bitacoraGen } from '@/api_queries/prestamos'

export default {
    name: 'BitacoraGeneralTab',
    components: {BitacoraGeneralItem},
    data () {
        return {
            consult: [],
            fechaI:'',
            fechaO:'',
        }
    },
    methods: {
            async wop(){
                console.log(this.fechaI)
                console.log(this.fechaO)
                this.consult = await bitacoraGen(this.fechaI, this.fechaO)
             }
     },
   // async mounted() {
   //     await this.onInit()
   // },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.list-wrapper {
    --height: 20.6cm;
}

@media screen and ( max-height: 1080px) {
    .list-wrapper {
        --height: 19.6cm;
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