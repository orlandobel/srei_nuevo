<template>
    <div class="row bg vh-100 justify-content-center">
        <div class="col-xl-3 col-xxl-3 align-self-center">
            <div class="card">
                <div v-if="successMsg !== ''" class="alert alert-success">
                    <div v-html="successMsg" class="mensajeGeneral"></div>
                </div>

                <div v-if="errorMsg !== ''" class="alert alert-danger">
                    <div v-html="errorMsg" class="mensajeError"></div>
                </div>
                
                <h5 class="card-header">Recuperación de contraseña</h5>
                <div class="card-body px-4">
                    <form action @submit.prevent="enviar">
                        <div class="row mb-3">
                            <label for="rfc" class="form-label text-start">Nueva contraseña</label>
                            <input type="password" name="clave1" id="clave1" 
                                class="form-control" v-model="clave1">
                        </div>
                        <div class="row mb-3">
                            <label for="password" class="form-label text-start">Repita su nueva contraseña</label>
                            <input type="password" name="clave2" id="clave2" class="form-control" v-model="clave2">
                        </div>
                        <div class="row justify-content-end pe-xl-2 pe-xxl-3">
                            <div class="col-xl-3">
                                <button class="btn btn-primary btn-rounded">Envíar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { recuperarClave } from '@/api_queries/usuarios.js';

export default {
    name: 'RecuperarClave',
    data() {
        return {
            clave1: '',
            clave2: '',
            successMsg: '',
            errorMsg: '',
            errores: [],
        }
    },
    methods: {
        enviar() {
            this.errorMsg = '';
            this.errores = [];
            
            if(!this.validarClave(this.clave1))
                this.errores.push("Clave no es valida o esta vacía");

            if(this.clave1 !== this.clave2 || !this.validarClave(this.clave2))
                this.errores.push("Las claves no coinciden")

            if(this.errores.length > 0) {
                this.errorMsg += "<ul>";
                this.errores.forEach(error => {
                    this.errorMsg += `<li>${error}</li>`;
                });
                this.errorMsg += "</ul>";

                return;
            }
            
            recuperarClave(this.$route.params.token, this.clave1).then(() => {
                this.successMsg = 'Contraseña actualizada exitosamente, redirigiendo al login';
                setTimeout(() => this.$router.push({name: 'login'}), 2000);
            }).catch(errores => {
                this.errorMsg += "<ul>";
                errores.forEach(error => {
                    this.errorMsg += `<li>${error}</li>`;
                });
                this.errorMsg += "</ul>";
            });
            
        },
        validarClave(clave) {
            const _pass_pattern = "^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*[0-9]).{8,32}$";
            if(clave.match(_pass_pattern)){
                return true
            }
            
            return false
        }
    },
    mounted() {
        this.$store.dispatch('usuario', null)
        this.$store.dispatch('laboratorio', null)
    }
}
</script>

<style lang="scss" scoped>
@import '../../node_modules/bootstrap/scss/functions';
@import '../styles/_variables';

.bg {
    background-color: $red-600;
}
.mensajeError{
    text-align: justify;
}

input {
    -webkit-text-security: disc;
}
</style>