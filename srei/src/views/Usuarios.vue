<template>
    <div class="row">
        <sidebar />
        <div class="col-lg-10">
            <div class="row justify-content-center h-100 mh-100">
                <div class="col-lg-12 h-100 mh-100 d-flex">
                    <div class="card h-95 mh-95 w-100 mw-100 align-self-center">
                        <div class="card-header border-0">
                            <!-- Pestañas de tabulación -->
                            <ul class="nav nav-tabs" id="tab-inicio" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link active" id="alumnos-tab" href="#alumnos"
                                        data-bs-toggle="tab" role="tab" aria-controls="alumnos" aria-selected="true" aria-current="alumnos">
                                            Alumnos
                                    </a>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <a class="nav-link" id="ususarios-tab" href="#trabajadores"
                                        data-bs-toggle="tab" role="tab" aria-controls="trabajadores" aria-selected="false">
                                            Trabajadores
                                    </a>
                                </li>
                            </ul>
                            <!-- Fin de las pestañas de tabulación -->
                        </div>
                        <div class="card-body tab-wrapper overflow-auto">
                            <!-- Secciones de tabulación -->
                            <div class="tab-content " id="tab-inicio-content">
                                <div class="tab-pane fade px-2 h-100 mh-100 active show" id="alumnos" role="tabpanel" aria-labelledby="alumnos-tab">
                                    <tabla-alumnos />
                                </div>
                                <div class="tab-pane fade px-2 h-100 mh-100" id="trabajadores" role="tabpanel" aria-labelledby="trabajadores-tab">
                                    Trabajadores
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
import Sidebar from '@/components/Sidebar.vue';
import TablaAlumnos from '@/components/tabulaciones-usuarios/Alumnos/TablaAlumnos.vue';

export default {
    name: 'Usuarios',
    components: {
        Sidebar,
        TablaAlumnos,
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