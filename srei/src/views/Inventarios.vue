<template>
    <div class="row">
        <sidebar />
        <equipo-modal v-on:guardado="equipo_guardado($event)" />
        <div class="col-lg-10">
            <api-message class="mt-2" v-if="success"
                :mensaje="mensaje" :success='true'/>

            <api-message class="mt-2"
                mensaje="" :success='false' ref="error_messages"/>

            <!--api-message v-if="error_imagen"
                    :error_bind="true" message_bind="Error al guardar la imagen, intentelo de nuevo más tarde" /-->

            <div class="row justify-content-center h-100 mh-100">
                <div class="col-lg-12 d-flex flex-column">
                    <div class="row justify-content-end my-3">
                        <div class="col-lg-2">
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#equipoModal" @click="set_creacion(true)">Añadir equipo</button>
                        </div>
                    </div>

                    <div class="row flex-grow-1">
                        <div class="col-lg-12 pb-3">
                            <div class="card align-self-center h-100 mh-100 w-100 mh-100">
                                <h3 class="card-header text-start fw-bold py-3 ps-4">Inventario de eléctronica</h3>
                                <div class="card-body p-2 overflow-auto">
                                    <datatable @removido="elm_msg()" @error="errors($event)" ref="lista" />
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
//import ApiMessage from '@/components/inventarios/ApiMessage.vue'
import ApiMessage from '@/components/ApiMessage.vue'

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
            mensaje: '',
            success: false,
        }
    },
    methods: {
        ...mapActions('equipo_inventario', ['set_creacion']),
        equipo_guardado(event) {
            this.mensaje = event.msg;
            this.succes = true;

            setTimeout(() => this.success = false, 3000)
            if(event.error_imagen)
                this.$refs.error_messages.displayErrors(["Error al guardar la imagen, intentelo de nuevo más tarde"]);

            if(event.crear) {
                this.$refs.lista.agregar(event.eqp)
            } else {
                this.$refs.lista.actualizar_equipo(event.eqp)
            }
        },
        elm_msg() {
            this.mensaje = "Equipo eliminado exitosamente";
            this.success = true;

            setTimeout(() => this.success = false, 3000);
        },
        errors(error) {
            this.$refs.error_messages.displayErrors(error);
        }
    }
}
</script>

<style lang="scss" scoped>

.card-body {
    --height: 21cm;
    --width: 21cm;
}

@media screen and ( max-height: 1080px ) {
    .card-body {
        --height: 20cm
    }
}

.card-body {
    height: var(--height);
    max-height: var(--width);
}

.h-95 {
    height: 95%;
}

.mh-95 {
    max-height: 95%;
}
</style>