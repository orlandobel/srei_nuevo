<template>
    <div class="row overflow-hidden">
        <div class="col-lg-12">
            <!-- Cabezera de la sección -->
            <div class="row header pd-1">
                <div class="col-9 d-flex">
                    <b class="h3 align-self-center fw-bolder me-4">Bitácora de prestamos del día</b>
                </div>
            </div>
            <!-- Fin de la cabezera -->

            <!-- Lista de de la bitácora -->
            <div class="row list-wrapper">
                <div class="col-12 py-2 px-2 h-100 mh-100">
                    <ul class="list-group list-group-flush p-2 border border-dark rounded-3 h-100 mh-100 overflow-auto">
                        <li class="list-group-item d-flex align-items-start">
                            <ul class="list-group list-group-horizontal w-100 fw-bold">
                                <li class="list-group-item w-25 border-0 border-end">Mesa</li>
                                <li class="list-group-item w-100 border-0 border-end">Nombre</li>
                                <li class="list-group-item w-25 border-0 border-end">Boleta</li>
                                <li class="list-group-item w-50 border-0 border-end">Hora de prestamo</li>
                                <li class="list-group-item w-50 border-0 border-end">Hora de devolución</li>
                                <li class="list-group-item w-75 border-0">Equipo</li>
                            </ul>
                        </li>
                        <bitacora-item :prestamo="prestamo" :index="0"/>
                    </ul>
                </div>
            </div>
            <!-- Fin de la bitácora -->
        </div>
    </div>
</template>

<script>
import BitacoraItem from '@/components/tabulaciones-inicio/bitacora/BitacoraItem.vue'

export default {
    name: 'BitacoraTab',
    components: {
        BitacoraItem,
    },
    data() {
        return {
            prestamo: {
                alumnos: [
                    {
                        usuario: "2018671281",
                        nombre: "Orlando Odiseo Belmonte Flores",
                        programa: "Intenieria en sistemas computacionales"
                    }
                ],
                equipo: [
                    {
                        nombre: "Prueba 1",
                        fabricante: "Odiseo",
                        modelo: "O1",
                        serie: "001"
                    },
                    {
                        nombre: "Fuente de alimentacion",
                        fabricante: "JasbroMan",
                        modelo: "Upiiz",
                        serie: "2015-2020"
                    },
                    {
                        nombre: "Broca",
                        fabricante: "JasbroMan",
                        modelo: "Upiiz",
                        serie: "2015-2020"
                    }
                ],
                mesa: "Mesa 1",
                activo: true,
                creado: "19:25:25"
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.list-wrapper {
    height: 20.6cm;
    max-height: 20.6cm;
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