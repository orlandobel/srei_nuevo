<template>
    <div class="row ">
        <sidebar />
        <div class="col-lg-10 ">
            <api-message class="mt-2" v-if="success"
                :mensaje="mensaje" :success='true'/>

            <api-message class="mt-2"
                mensaje="" :success='false' ref="error_messages"/>

            <div class="row justify-content-center h-100 mh-100">
                <div class="col-lg-12 h-100 mh-100 d-flex">
                    <div class="card h-95 mh-95 w-100 mw-100 align-self-center">
                        <div class="card-header border-0">
                            <!-- Pestañas de tabulación -->
                            <ul class="nav nav-tabs" id="tab-inicio" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link active" id="prestamos-tab" href="#prestamos"
                                        data-bs-toggle="tab" role="tab" aria-controls="prestmos" aria-selected="true" aria-current="prestamos">
                                            Nuevo prestamo
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="ususarios-tab" href="#usuarios"
                                        data-bs-toggle="tab" role="tab" aria-controls="usuarios" aria-selected="false">
                                            Usuarios del laboratorio
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="bitacora-tab" href="#bitacora"
                                        data-bs-toggle="tab" role="tab" aria-controls="bitacora" aria-selected="false">
                                            Bitácora del día
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="bitacoraGlob-tab" href="#bitacoraGlob"
                                        data-bs-toggle="tab" role="tab" aria-controls="bitacoraGlob" aria-selected="false">
                                            Bitácora periodica
                                    </a>
                                </li>
                            </ul>
                            <!-- Fin de las pestañas de tabulación -->
                        </div>
                        <div class="card-body tab-wrapper overflow-auto">
                            <!-- Secciones de tabulación -->
                            <div class="tab-content " id="tab-inicio-content">
                                <div class="tab-pane fade px-2 h-100 mh-100 show active" id="prestamos" role="tabpanel" aria-labelledby="prestamos-tab">
                                    <prestamos-tab @prestamoGenerado="prestamoGenerado()" @erroresPrestamo="erroresPrestamo($event)"/>
                                </div>
                                <div class="tab-pane fade px-2 h-100 mh-100" id="usuarios" role="tabpanel" aria-labelledby="usuarios-tab">
                                    <alumnos-laboratorio-tab />
                                </div>
                                <div class="tab-pane fade h-100 mh-100 " id="bitacora" role="tabpanel" aria-labelledby="bitacora-tab">
                                    <bitacora-tab />
                                </div>
                                <div class="tab-pane fade h-100 mh-100" id="bitacoraGlob" role="tabpanel" aria-labelledby="bitacoraGlob-tab">
                                    <bitacora-general-tab />
                                </div>
                            </div>
                            <!-- Fin de secciones de tabulación -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import PrestamosTab from '@/components/tabulaciones-inicio/prestamos/PrestamosTab.vue';
import AlumnosLaboratorioTab from '@/components/tabulaciones-inicio/alumnos_laboratorio/AlumnosLaboratorioTab.vue';
import ApiMessage from '@/components/ApiMessage.vue';
import BitacoraTab from '@/components/tabulaciones-inicio/bitacora/BitacoraTab.vue';
import BitacoraGeneralTab from '@/components/tabulaciones-inicio/bitacoraGeneral/BitacoraGeneralTab.vue';


export default {
    name: 'Home',
    components: {
        Sidebar,
        PrestamosTab,
        AlumnosLaboratorioTab,
        BitacoraTab,
        ApiMessage,
        BitacoraGeneralTab,
    },
    data() {
        return {
            success: false,
            mensaje: '',
        }
    },
    methods: {
        prestamoGenerado() {
            console.info("mostrando alerta")
            this.success = true;
            this.mensaje = "Prestamo agregado a la bitácora";

            setTimeout(() => {
                this.success = false;
                this.mensaje = '';
            }, 3000);
        },
        erroresPrestamo(errores) {
            this.$refs.error_messages.displayErrors(errores);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

.tab-wrapper {
    height: 23cm;
    max-height: 23cm;
}

.h-95 {
    height: 95%;
}

.mh-95 {
    max-height: 95%;
}
</style>