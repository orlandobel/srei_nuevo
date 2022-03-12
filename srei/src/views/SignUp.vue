<template>
    <div class="row bg vh-100 justify-content-center">
        <div class="col-xl-3 col-xxl-3 align-self-center">
            <div class="card">
                <div v-if="errorMsg !== ''" class="alert alert-danger">
                    <div v-html="errorMsg" class="mensajeError"></div>
                </div>
                <h5 class="card-header">Registro</h5>
                <div class="card-body px-4">
                    <form action @submit.prevent="">
                        <div class="row mb-3">
                            <label for="rfc" class="form-label text-start">Nombre</label>
                            <input type="text" name="nombre" id="nombre" class="form-control" v-model="nombre">
                        </div>
                        <div class="row mb-3">
                            <label for="rfc" class="form-label text-start">RFC</label>
                            <input type="text" name="rfc" id="rfc" class="form-control" v-model="rfc">
                        </div>
                        <div class="row mb-3">
                            <label for="password" class="form-label text-start">Contraseña</label>
                            <input type="password" name="password" id="password" class="form-control" v-model="password">
                        </div>
                        <div class="row mb-3">
                            <label for="passwordCheck" class="form-label text-start">Confirmar Contraseña</label>
                            <input type="password" name="passwordCheck" id="passwordCheck" class="form-control" v-model="passwordCheck">
                        </div>
                        <div class="row mb-3">
                            <label for="lab" class="form-label text-start">Seleccionar laboratorio</label>
                            <select class="form-control form-select form-select-lg mb-3" name="lab" id="lab" v-model="labs">
                                <option v-for="rest in labs" :key="rest.id" :value="rest.id" >{{rest.nombre}}</option>
                            </select>
                        </div>
                        <div class="row justify-content-end pe-xl-2 pe-xxl-3">
                            <div class="col-xl-6">
                                <router-link :to="{name: 'login'}" class="btn d-inline-flex text-primary">Volver al login</router-link>
                            </div>
                            <div class="col-xl-4">
                                <button class="btn btn-primary btn-rounded">Registrarme</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { listaSimple } from '@/api_queries/laboratorios'

export default {
    name: 'SignUp',
    data() {
        return {
            nombre:'',
            rfc: '',
            password: '',
            passwordCheck:'',
            labs:[],
            errorMsg: '',
        }
    },
    methods: {
        async setLabs(){
            this.labs = await listaSimple();
            console.log(this.labs)
        }
    },
    mounted() {
        this.setLabs()
    },
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