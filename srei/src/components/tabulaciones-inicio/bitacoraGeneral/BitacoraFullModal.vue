<template>
    <div class="modal fade" id="fullModal" data-bs-backdrop="static" data-bs-keyboard="false"  tabindex="-1" aria-labelledby="fullModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="fullModalLabel">Prestamo realizado el día {{ fecha.split("T")[0] }} a las {{ fecha.split("T")[1].split('.')[0] }}</h5>
                    <button class="btn btn-outline-danger" data-bs-dismiss="modal">X</button>
                </div>
                <div class="modal-body">
                    <div class="row list-wrapper">
                        <div class="col-12 py-2 px-2 h-50 mh-50">
                        <h6 class="fw-bold"> Alumnos y/o encargados</h6>
                            <table class="table rounded-3 h-100 mh-100">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Programa</th>
                                        <th scope="col">Boleta</th>
                                        <th scope="col">Vetado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="alumno in alumnos" :key="alumno._id">
                                        <td>
                                            {{ alumno.nombre.toLowerCase().replace(/\w\S*/g, (w) => (
                                                w.replace(/^\w/, (c) => c.toUpperCase())
                                            )) }}
                                        </td>
                                        <td>
                                            {{ alumno.programa.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }}
                                        </td>
                                        <td> {{ alumno.usuario }} </td>
                                        <td v-if="alumno.vetado.length == 0"> No </td>
                                        <th v-else> Sí </th>   
                                    </tr>
                                </tbody>
                            </table>


                        </div>
                        <div class="col-12 py-2 px-2 h-50 mh-50">
                        <h6 class="fw-bold"> Equipo prestado</h6>
                            <table class="table rounded-3 h-100 mh-100">
                                <thead>
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Modelo</th>
                                        <th scope="col">Fabricante</th>
                                        <th scope="col">serie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="equipo in equipos" :key="equipo._id">
                                        <td> {{ equipo.nombre }} </td>
                                        <td> {{ equipo.modelo }} </td>
                                        <td> {{ equipo.fabricante }} </td>
                                        <td> {{ equipo.serie }} </td> 
                                    </tr>
                                </tbody>
                            </table>

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
        name: "bitacoraFullModal",
        components: { 
        },
        props: {
            alumnos: { type: Array, required: true },
            equipos: { type: Array, required: true },
            fecha: { type: String, required: true },
        },
        
        methods: {
        },
    }
</script>

<style scoped>

</style>