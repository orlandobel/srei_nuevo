<template>
    <div class="row bg vh-100 justify-content-center">
        <div class="col-xl-3 col-xxl-3 align-self-center">
            <div class="card">
                <div v-if="errorMsg !== ''" class="alert alert-danger">
                    <div v-html="errorMsg" class="mensajeError"></div>
                </div>
                <h5 class="card-header">Recuperación de contraseña</h5>
                <div class="card-body px-4">
                    <form action @submit.prevent="enviar">
                        <div class="row mb-3">
                            <label for="rfc" class="form-label text-start">RFC</label>
                            <input type="text" name="rfc" id="rfc"
                                style="text-transform: uppercase"
                                class="form-control" v-model="rfc">
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
import { claveOlvidada } from '@/api_queries/usuarios.js';

export default {
    name: 'ClaveOlvidada',
    data() {
        return {
            rfc: '',
            errorMsg: '',
        }
    },
    methods: {
        enviar() {
            this.errorMsg = '';
            
            claveOlvidada(this.rfc).then(res => {
                console.log(res);
            }).catch(errores => {
                this.errorMsg += "<ul>";
                errores.forEach(error => {
                    this.errorMsg += `<li>${error}</li>`;
                });
                this.errorMsg += "</ul>";
            });
        },
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

</style>