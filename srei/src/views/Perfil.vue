<template>
    <div class="row">
        <sidebar />
        <div class="col-lg-10">
            <api-message class="mt-2" v-if="success"
                :mensaje="mensaje" :success='true'/>

            <api-message class="mt-2"
                mensaje="" :success='false' ref="error_messages"/>
                
            <div class="row h-100 mh-100">
                <div class="col-lg-12 justify-content-center h-100 mh-100 d-flex ">
                    <div class="card  w-25 align-self-center text-start">
                        <form @submit.prevent="send()">
                            <div class="card-header border-0">
                                <h5 class="card-title fw-bold">Cambiar contraseña</h5>
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="clave_old" class="form-label">Contraseña</label>
                                    <input type="password" name="clave_old" class="form-control"
                                        v-model="clave_old" />
                                </div>

                                <div class="form-group">
                                    <label for="clave_new" class="form-label">Nueva contraseña</label>
                                    <input type="password" name="clave_new" class="form-control"
                                        v-model="clave1">
                                </div>

                                <div class="form-group">
                                    <label for="clave_new_confirm" class="form-label">Repita la nueva contraseña</label>
                                    <input type="password" name="clave_new_confirm" class="form-control"
                                        v-model="clave2">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-primary" @click.prevent="send()">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import ApiMessage from '@/components/ApiMessage.vue';

import { cambiarClave } from '@/api_queries/usuarios.js'; 

export default {
    name: 'Perfil',
    components: {
        Sidebar,
        ApiMessage,
    },
    data() {
        return {
            clave_old: '',
            clave1: '',
            clave2: '',
            mensaje: 'Contraseña actualizada con éxito',
            success: false
        }
    },
    methods: {
        send() {
            const data = {
                id: this.$store.getters.usuario._id,
                clave_old: this.clave_old,
                clave1: this.clave1,
                clave2: this.clave2
            };

            cambiarClave(data).then(() => {
                this.success = true;

                setTimeout(() => {
                    this.mensaje = '',
                    this.success = false;
                }, 3000);

                this.clave_old = '';
                this.clave1 = '';
                this.clave2= '';
            }).catch(error => {
                this.$refs.error_messages.displayErrors(error);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../styles/_variables.scss';

/*.tab-wrapper {
    height: 23cm;
    max-height: 23cm;
}*/

.h-95 {
    height: 95%;
}

.mh-95 {
    max-height: 95%;
}
</style>