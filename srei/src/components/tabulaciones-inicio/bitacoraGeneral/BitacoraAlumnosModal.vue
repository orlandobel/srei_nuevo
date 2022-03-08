<template>
    <div class="modal fade" id="alumnosModal" data-bs-backdrop="static" data-bs-keyboard="false"  tabindex="-1" aria-labelledby="alumnosModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="alumnosModalLabel">Lista de encargados el día: {{ fecha.split("T")[0] }}</h5>
                    <button class="btn btn-outline-danger" data-bs-dismiss="modal">X</button>
                </div>
                <div class="modal-body">
                    <div class="row list-wrapper">
                        <div class="col-12 py-2 px-2 h-100 mh-100">
                            <ul class="list-group list-group-flush p-2 border rounded-3 h-100 mh-100 overflow-auto">
                                <ul class="list-group list-group-horizontal w-100 fw-bold">
                                    <li class="list-group-item w-100 border-0 border-end">Nombre</li>
                                    <li class="list-group-item w-100 border-0 border-end">Programa</li>
                                    <li class="list-group-item w-100 border-0 border-end">Boleta</li>
                                    <li class="list-group-item w-100 border-0">Vetado</li>
                                </ul>
                                <ul v-for="alumno in alumnos" :key="alumno._id"  class="list-group list-group-horizontal w-100">
                                        <li class="list-group-item w-100  border-0 border-end">
                                        {{ alumno.nombre.toLowerCase().replace(/\w\S*/g, (w) => (
                                                w.replace(/^\w/, (c) => c.toUpperCase())
                                            )) }}
                                        </li>
                                        <li class="list-group-item w-100  border-0 border-end">
                                        {{ alumno.programa.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }}
                                        </li>
                                        <li class="list-group-item w-100  border-0 border-end">{{ alumno.usuario }}</li>

                                        <li v-if="alumno.vetado.length == 0" class="list-group-item w-100  border-0">No</li>
                                        <li v-else class="list-group-item w-100  border-0">Sí</li>
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
        name: "bitacoraAlumnosModal",
        components: { 
        },
        props: {
            alumnos: { type: Array, required: true },
            fecha: { type: String, required: true },
        },
        
        methods: {
        },
    }
</script>

<style scoped>

</style>