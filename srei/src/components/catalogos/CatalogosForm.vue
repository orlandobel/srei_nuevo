<template>
<div class="row justify-content-center">
        <div class="col-xl-6 ">
            <div class="card">
                <h2 class="card-header">Obtener catálogo</h2>
                <div class="card-body px-4">
                    <form action @submit.prevent="searchCatalogue">
                        <div class="row mb-2">
                            <label for="labPick" class="form-label text-start">Laboratorio</label>
                            <select class="form-control form-select form-select-lg mb-3" name="labPick" id="labPick" v-model="labPick">
                                <option v-for="rest in labOfUser" :key="rest.id" :value="rest.id" >{{rest.nombre}}</option>
                            </select>
                        </div>
                        <div class="row mb-3">
                            <label for="typePick" class="form-label text-start">Tipo</label>
                            <select class="form-control form-select form-select-lg mb-3" name="typePick" id="typePick" v-model="typePick">
                                <option value="electronica">Electronica</option>
                                <option value="maquinaria">Maquinaria</option>
                                <option value="targetas_programables">Tarjetas programables</option>
                                <option value="personal">Personal</option>
                            </select>
                        </div>
                        <div class="row justify-content-end pe-xl-2 pe-xxl-3">
                            <div class="col-xl-3">
                                <button class="btn btn-primary btn-rounded">Buscar catálogo </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { listaSimple } from '@/api_queries/laboratorios'

export default {
        name: "CatalgosForm",

        data () {
            return {
                labOfUser: [],
                labPick: '',
                typePick: '',
            }
        },
        methods: {

            initData() {
                // añadimos los laboratoirios existentes
                this.labOfUser = [{
                        nombre: this.$store.getters.laboratorio.nombre,
                        id: this.$store.getters.laboratorio._id
                }]
                //en el caso de existir más cambiar a un labOfUser.foreach(eq=>{labOfUser.push(eq)})
            },

            async searchCatalogue() {
                const params = {
                    laboratorio: this.labPick,
                    tipo: this.typePick
                }

                try {
                    console.log("Laboratorio obtenido: "+params.laboratorio)
                    console.log("tipo obtenido: "+ params.tipo)

                    console.log("TODO: HACER CONSULTA QUE RETORNE PDF Y PODER VISUALIZARLO")

                } catch(error) {
                    console.log("Algo raro pasó: "+ error)
                }
            },
        },
        mounted() {
            this.initData()
        },
        

}
</script>

<style>

</style>