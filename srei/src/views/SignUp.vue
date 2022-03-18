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
                            <input type="text" name="rfc" id="rfc" class="form-control" style="text-transform: uppercase" v-model="rfc">
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
            // patron del RFC, persona moral
            _rfc_pattern_pm: "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
                  "(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
                  "(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
                  "(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$",
            // patron del RFC, persona fisica
            _rfc_pattern_pf: "^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
                       "(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
                       "(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
                       "(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$",
        }
    },
    methods: {
        async setLabs(){
            this.labs = await listaSimple();
            console.log(this.labs)
        },
        
        ValidaRFC(){
            console.log("Entre")
            this.rfc = this.rfc.toUpperCase();
            if (this.rfc.match(this._rfc_pattern_pm) || this.rfc.match(this._rfc_pattern_pf)){
                console.log("soy un rfc: "+ this.rfc)
                    return true;
                }else {
                console.log("No soy un rfc: "+ this.rfc)
                    return false;
                }
        },

        ValidarPassword(){
            const _pass_pattern = "^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*[0-9]).{8,32}$";
            if(this.password.match(_pass_pattern)){
                console.log("contraseña fuerte")
                return true
            }
            console.log("que es esto: "+ this.password)
            return false
        },

        async signIn() {
            this.errorMsg =''
            this.successMsg = ''
            let errorFlag = 0;
            const params = {
                nombre: this.nombre,
                usuario: this.rfc.toUpperCase(),
                clave: this.password,
                laboratorio: this.labPick,
                passwordCheck: this.passwordCheck
            }
            

            try {
                //validadcion de campos vacios
                if (params.nombre == "" || params.usuario == "" || params.clave == "" || params.laboratorio == "" || params.passwordCheck == ""){
                    this.errorMsg += "<p><strong>¡Error al llenar formulario!</strong></p>"
                    this.errorMsg += "<ul>"
                    if (params.nombre == "") this.errorMsg += "<li>Asegúrese de inscribir su nombre.</li>"
                    if (params.usuario == "") this.errorMsg += "<li>Asegúrese de inscribir su RFC.</li>"
                    if (params.clave == "" && params.passwordCheck == "") this.errorMsg += "<li>Asegúrese de inscribir una contraseña .</li>"
                    if (params.clave == "" || params.passwordCheck == "") this.errorMsg += "<li>Asegúrese de validar la contraseña previamente inscrita.</li>"
                    if (params.laboratorio == "") this.errorMsg += "<li>Asegúrese de seleccionar un laboratorio.</li>"
                    this.errorMsg += "</ul>"
                    errorFlag ++
                }
                //validar longitud minima de nombre
                if (params.nombre.length < 3){
                    this.errorMsg += "<p><strong>¡Error en nombre!</strong></p>"
                    this.errorMsg += "<p>Se recomienda usar nombre completo</p>"
                    errorFlag ++
                }

                //validadcion de rfc con regex del sat
                if (!this.ValidaRFC()){
                    this.errorMsg += "<p><strong>¡Error en RFC!</strong></p>"
                    this.errorMsg += "<p>Necesita un RFC valido</p>"
                    errorFlag ++
                }
                //validacion de contraseña con campos destacados
                if (!this.ValidarPassword()){
                    this.errorMsg += "<p><strong>¡Error al registrar contraseña!</strong></p>"
                    this.errorMsg += "<p>la contraseña debe tener entre 8 a 32 caracteres con al menos:</p>"
                    this.errorMsg += "<ul>"
                    this.errorMsg += "<li>Un numero</li>"
                    this.errorMsg += "<li>Una mayuscula</li>"
                    this.errorMsg += "<li>Una minuscula</li>"
                    this.errorMsg += "</ul>"
                    errorFlag ++
                }
                if (params.clave != params.passwordCheck){
                    this.errorMsg += "<p> Recuerde que la contraseña inscrita <strong> debe ser la misma en los 2 campos de contraseña. </strong></p>"
                }

                if (errorFlag!= 0){
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
                    else this.errorMsg = "<p><strong>¡Error desconocido al registrarse!</strong></p>"
                    
                }
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