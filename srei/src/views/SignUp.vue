<template>
    <div class="row bg vh-100 justify-content-center">
        <div class="col-xl-3 col-xxl-3 align-self-center">
            <div class="card">
                <div v-if="successMsg !== ''" class="alert alert-success">
                    <div v-html="successMsg" class="mensajeGeneral"></div>
                </div>
                <div v-if="errorMsg !== ''" class="alert alert-danger">
                    <div v-html="errorMsg" class="mensajeGeneral"></div>
                </div>
                <h5 class="card-header">Registro</h5>
                <div class="card-body px-4">
                    <form action @submit.prevent="signIn()">
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
                            <label for="labPick" class="form-label text-start">Seleccionar laboratorio</label>
                            <select class="form-control form-select form-select-lg mb-3" name="labPick" id="labPick" v-model="labPick">
                                <option v-for="rest in labs" :key="rest._id" :value="rest._id" >{{rest.nombre}}</option>
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
import { SignIn } from '@/api_queries/usuarios'

export default {
    name: 'SignUp',
    data() {
        return {
            labs:[],
            nombre:'',
            rfc: '',
            password: '',
            passwordCheck:'',
            labPick:'',
            errorMsg: '',
            successMsg: '',
        }
    },
    methods: {
        async setLabs(){
            this.labs = await listaSimple();
            console.log(this.labs)
        },
        
        checkValues(){
            
            console.log(nombre.value)
            console.log(rfc.value)
            console.log(password.value)
            console.log(passwordCheck.value)
            console.log(labPick.value)
        },
        async signIn() {
            this.errorMsg =''
            this.successMsg = ''
            const params = {
                nombre: this.nombre,
                usuario: this.rfc,
                clave: this.password,
                laboratorio: this.labPick,
                passwordCheck: this.passwordCheck
            }

            try {

                if (params.nombre == "" || params.usuario == "" || params.clave == "" || params.laboratorio == "" || params.passwordCheck == ""){
                    this.errorMsg = "<p><strong>¡Error al registrarse!</strong></p>"
                    this.errorMsg += "<ul>"
                    if (params.nombre == "") this.errorMsg += "<li>Asegúrese de inscribir su nombre.</li>"
                    if (params.usuario == "") this.errorMsg += "<li>Asegúrese de inscribir su RFC.</li>"
                    if (params.clave == "" && params.passwordCheck == "") this.errorMsg += "<li>Asegúrese de inscribir una contraseña .</li>"
                    if (params.clave == "" || params.passwordCheck == "") this.errorMsg += "<li>Asegúrese de validar la contraseña previamente inscrita.</li>"
                    if (params.laboratorio == "") this.errorMsg += "<li>Asegúrese de seleccionar un laboratorio.</li>"
                    this.errorMsg += "</ul>"
                    throw new Error('oops');
                }
                const response = await SignIn(params)
                if(response.status == 200)
                    this.successMsg  = "<p><strong>¡Exito en el registro de datos!</strong></p>"
                    this.successMsg += "<p>Recuerde que este registro al sistema esta en espera, comuniquese con alguno de los laboratoristas registrados para confirmar y terminar su registro</p>"
            } catch(error) {
                console.log(error.message)
                if (error.message != 'oops'){
                    const response = error.response
                    const status = response.status 
                    if (status == 404) this.errorMsg = "<p><strong>¡Error de conexion!</strong> intente su registro en otro momento</p>"
                    else this.errorMsg = "<p><strong>¡Error al registrarse!</strong></p>"
                    
                    if (params.clave != params.passwordCheck){
                        this.errorMsg += "Recuerde que la contraseña inscrita debe ser la misma en los 2 campos de contraseña.</p>"
                    }
                }
                console.log(error)
            }
        },
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
.mensajeGeneral{
text-align: justify;
}
</style>