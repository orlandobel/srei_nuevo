<template>
    <div class="modal fade" id="equiposModal" data-bs-backdrop="static" data-bs-keyboard="false"  tabindex="-1" aria-labelledby="equiposModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="equipoModalLabel">Prestamo realizado el día: {{ fecha.split("T")[0] }}</h5>
                    <button class="btn btn-outline-danger" data-bs-dismiss="modal">X</button>
                </div>
                <div class="modal-body">
                    <div class="row list-wrapper">
                        <div class="col-12 py-2 px-2 h-100 mh-100">
                            <ul class="list-group list-group-flush p-2 border rounded-3 h-100 mh-100 overflow-auto">
                                <ul class="list-group list-group-horizontal w-100 fw-bold">
                                    <li class="list-group-item w-100 border-0 border-end">Nombre</li>
                                    <li class="list-group-item w-100 border-0 border-end">Modelo</li>
                                    <li class="list-group-item w-100 border-0 border-end">Fabricante</li>
                                    <li class="list-group-item w-100 border-0">Serie</li>
                                </ul>
                                <ul v-for="equipo in equipos" :key="equipo._id"  class="list-group list-group-horizontal w-100">
                                        <li class="list-group-item w-100  border-0 border-end">{{ equipo.nombre }}</li>
                                        <li class="list-group-item w-100  border-0 border-end">{{ equipo.modelo }}</li>
                                        <li class="list-group-item w-100  border-0 border-end">{{ equipo.fabricante }}</li>
                                        <li class="list-group-item w-100  border-0">{{ equipo.serie }}</li>
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--div class="modal-footer">
                    <button class="btn btn-danger" data-bs-dismiss="modal" @click="reiniciar">Cancelar</button>
                    <button class="btn btn-success" @click="guardar">Enviar</button>
                </div-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "bitacoraEquipoModal",
        components: { 
        },
        props: {
            equipos: { type: Array, required: true },
            fecha: { type: String, required: true },
        },
        
        methods: {
        },
    }
</script>

<style scoped>

</style>