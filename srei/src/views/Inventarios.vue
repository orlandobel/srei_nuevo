<template>
    <div class="row">
        <sidebar />
        <equipo-modal v-on:guardado="equipo_guardado($event)" />
        <div class="col-lg-10">
            <div class="row justify-content-center h-100 mh-100">
                <div class="col-lg-12 d-flex flex-column">
                    <div class="row justify-content-end my-3">
                        <div class="col-lg-2">
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#equipoModal" @click="set_creacion(true)">Añadir equipo</button>
                        </div>
                    </div>

                    <api-message v-if="msg != null"
                        :error_bind="false" :message_bind="msg" />
                    <api-message v-if="error_imagen"
                        :error_bind="true" message_bind="Error al guardar la imagen, intentelo de nuevo más tarde" />
                    <api-message v-if="eliminado != null"
                        :error_bind="!eliminado" :message_bind="msg_eliminado" />

                    <div class="row flex-grow-1">
                        <div class="col-lg-12 pb-3">
                            <div class="card align-self-center h-100 mh-100 w-100 mh-100">
                                <h3 class="card-header text-start fw-bold py-3 ps-4">Inventario de eléctronica</h3>
                                <div class="card-body p-2 overflow-auto">
                                    <datatable v-on:removido="elm_msg($event)"/>
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
import { mapActions } from 'vuex'
import ApiMessage from '@/components/inventarios/ApiMessage.vue'

export default {
    name: "Inventario",
    components: {
        Sidebar,
        Datatable,
        EquipoModal,
        ApiMessage,
    },
    data() {
        return {
            msg: null,
            error_imagen: false,
            eliminado: null,
            msg_eliminado: ''
        }
    },
    methods: {
        ...mapActions('equipo_inventario', ['set_creacion']),
        equipo_guardado(event) {
            this.msg = event.msg;
            this.error_imagen = event.error_imagen;

            setTimeout(() => this.msg = null, 3000)
            setTimeout(() => this.error_imagen = false, 5000)
        },
        reset_msg() {
            console.log('reiniciando mensaje');
            this.msg = null
        },
        elm_msg(elm) {
            this.eliminado = elm
            this.msg_eliminado = elm? "Equipo eliminado exitosamente" 
                                    : "Error al eliminar, intentelo de nuevo más tarde"

            setTimeout(() => this.eliminado = null, 5000)
        }
    }
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