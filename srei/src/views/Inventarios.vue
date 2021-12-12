<template>
    <div class="row">
        <sidebar />
        <equipo-modal />
        <div class="col-lg-10">
            <div class="row justify-content-center h-100 mh-100">
                <div class="col-lg-12 d-flex flex-column">
                    <div class="row justify-content-end my-3">
                        <div class="col-lg-2">
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#equipoModal" >Añadir equipo</button>
                        </div>
                    </div>
                    <div class="row flex-grow-1">
                        <div class="col-lg-12 pb-3">
                            <div class="card align-self-center h-100 mh-100 w-100 mh-100">
                                <h3 class="card-header text-start fw-bold py-3 ps-4">Inventario de eléctronica</h3>
                                <div class="card-body p-2 overflow-auto">
                                    <datatable />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import Datatable from '@/components/inventarios/Datatable.vue'
import EquipoModal from '@/components/inventarios/EquipoModal.vue'

export default {
    name: "Inventario",
    components: {
        Sidebar,
        Datatable,
        EquipoModal,
    },
}
</script>

<style lang="scss" scoped>

.card-body {
    height: 21cm;
    max-height: 21cm;
}

.h-95 {
    height: 95%;
}

.mh-95 {
    max-height: 95%;
}
</style>