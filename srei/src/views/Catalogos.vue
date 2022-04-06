<template>
    <div class="row ">
        <sidebar />
        <div class="col-lg-10">
            <!-- TODO: Añadir mensajes de error en caso de que falle la descarga de los catalogos --> 

            <div class="row justify-content-center h-100 mh-100">
                <div class="col-lg-12 h-100 mh-100 d-flex">
                    <div class="card h-95 mh-95 w-100 mw-100 align-self-center">
                        <div class="card-header border-0">
                            <catalogosForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import CatalogosForm from '@/components/catalogos/CatalogosForm.vue';

export default {
    name: "Catalogos",
    components: {
        Sidebar,
        CatalogosForm,
    },
}
</script>

<style>

</style>