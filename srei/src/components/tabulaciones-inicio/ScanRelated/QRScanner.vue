<template>
    <div class="modal fade mh-75 h-75" id="scanModal" data-bs-backdrop="static" data-bs-keyboard="false"  tabindex="-1" aria-labelledby="scanModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="equipoModalLabel">Lista de prestamos</h5>
                    <button class="btn btn-outline-danger" data-bs-dismiss="modal" @click="reiniciar">X</button>
                </div>
                <div class="modal-body">
                    <div>
                        <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
                            
                            <div v-if="validationSuccess" class="validation-success">
                                {{ validMsg }}
                            </div>

                            <div v-if="validationFailure" class="validation-failure">
                                {{ validMsg }}
                            </div>

                            <div v-if="validationPending" class="validation-pending">
                                {{ validMsg}}
                            </div>
                        </qrcode-stream>
                    </div>

                    <div v-for="rest in results" :key="rest.id" class="card" >

                        <div v-if="isValidStudent(rest)" class="card-horizontal">
                            <div v-html="rest.imagen" class="img-square-wrapper"></div>
                            <div class="card-body">
                                <h6 class="card-title"><b>Alumno: </b>{{ rest.nombre }}</h6>
                                <p class="card-text">{{ rest.boleta }}</p>    
                            </div>
                        </div>
                        <div v-else-if="validateJSONdata(rest)" class="card-horizontal">
                            <div class="img-square-wrapper">
                                <img class="img-try" src="@/assets/sidebar/sidebar-bg.png" alt="Card image cap">
                            </div>
                            <div class="card-body">
                                <h6 class="card-title"><b>{{ rest.nombre }}</b></h6>
                                <p class="card-text">ID: {{ rest.id }} <br/> Laboratorio: {{ rest.laboratorio }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-bs-dismiss="modal" @click="reiniciar">Cancelar</button>
                    <button class="btn btn-success" @click="guardar">Enviar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { QrcodeStream } from "vue3-qrcode-reader";
    import axios from "axios";

    export default {
        name: "QRScanner",
        components: { 
            QrcodeStream,
        },

        data () {
            return {
            isValid: undefined,
            validMsg: "Camara desactivada",
            camera: 'off',
            results: [],
            }
        },
        computed: {
            validationPending () {
                return this.isValid === undefined
                && this.camera === 'off'
            },

            validationSuccess () {
                return this.isValid === true
            },

            validationFailure () {
                return this.isValid === false
            }
        },
        
        methods: {
            onInit (promise) {
                promise
                    .catch(console.error)
                    .then(this.resetValidationState)
            },

            async onDecode (result) {

                this.turnCameraOff()
                this.validMsg = "Cargando..."
                // pretend it's taking time
                await this.timeout(200)

                this.isValid = true
                if (this.validateJSON(result)){
                    let aux = JSON.parse(result)
                    if (this.validateJSONdata(aux)){
                        this.validMsg = "Lectura de herramienta exitosa"
                        this.results.push(aux)
                    }else{
                        this.isValid = false
                        this.validMsg = "QR obtenido no es una herramienta de laboratorio"
                    }
                }else if (this.isValidHttpUrl(result)){
                        
                    let alumDatos = await this.axiosConsult(result).then( data =>{
                        let getNombre = data.split("<div class='nombre'>")[1].split("</div>")[0]
                        let getBoleta = data.split("<div class='boleta' style='font-size: 200%;' >")[1].split("</div>")[0]
                        let getImagen = data.split("<div class='pic'>")[2].split("</div>")[0]
                        
                        let jsonResp ={
                            "nombre" : getNombre,
                            "boleta" : getBoleta,
                            "imagen" : getImagen
                        }

                        return jsonResp

                        }).catch(err => {
                            console.log(err)
                            return "error"
                            }
                        )

                    if (alumDatos != "error"){ 
                        this.results.push(alumDatos)                    
                        this.validMsg = "Lectura URL alumno exitosa"
                    }

                } else {
                    this.isValid = false
                    this.validMsg = "Fallo inesperado"
                }

                // some more delay, so users have time to read the message
                await this.timeout(300)

                this.turnCameraOn()
            },
            validateJSON(str){
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            },

            validateJSONdata(aux){
                try{
                    if ("id" in aux && "nombre" in aux && "laboratorio" in aux){
                        return true;
                    }
                }catch(e){
                    return false;
                }
            },

            isValidHttpUrl(string) {
                try {
                    let url = new URL(string);
                } catch (e) {
                    return false;  
                }
                return true;
            },

            isValidStudent(aux){
                try{
                    if ("nombre" in aux && "boleta" in aux && "imagen" in aux){
                        return true;
                    }
                }catch(e){
                    return false;
                }
            },

            resetValidationState () {
                this.isValid = undefined
            },

            reiniciar() {
                this.isValid = undefined,
                this.validMsg = "Camara desactivada",
                this.camera= 'off'
                this.results = []
            },

            guardar() {
            },

            turnCameraOn () {
                this.camera = 'auto'
            },

            turnCameraOff () {
                this.camera = 'off'
            },

            timeout (ms) {
                return new Promise(resolve => {
                    window.setTimeout(resolve, ms)
                })
            },

            axiosConsult(url){
                
                const promese = axios.get(url,{ 
                        transformRequest: (data, headers) => {
                            delete headers.common['Authorization'];
                            return data;
                        },
                    })
                const dataProm = promese.then(response =>  response.data)

                return dataProm

            },
        },
    }
</script>

<style scoped>
.validation-success,
.validation-failure,
.validation-pending {
    position: absolute;
    width: 100%;
    height: 100%;

    background-color: rgba(255, 255, 255, .8);
    text-align: center;
    font-weight: bold;
    font-size: 1.4rem;
    padding: 10px;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
}
.validation-success {
    color: green;
}
.validation-failure {
    color: red;
}
.card-horizontal {
  display: flex;
  flex: 1 1 auto;
}
.img-try {
  max-width: 160px;
}
</style>