<template>
    <div class="modal fade mh-75 h-75" id="scanModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="scanModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="equipoModalLabel">Lista de prestamos</h5>
                </div>
                <div class="modal-body">
                    
                    <button @click="toggelCamera">
                        <fa-icon :icon="['fas','microchip']" size="2x"/>
                    </button>
                    
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

                    <div v-for="rest in results" :key="results.id" class="card" >

                        <div v-if="isValidHttpUrl(rest)" class="card-body">
                            <h6 class="card-title"><b>Url alumno</b></h6>
                            <p class="card-text">Liga: {{ rest }}</p>
                            <a href="#" class="card-link">go to</a>
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
    import { QrcodeStream } from 'vue3-qrcode-reader'

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
                }else if (result.startsWith('http') ){
                    
                    this.validMsg = "Lectura URL alumno exitosa"
                    this.results.push(result)
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
            let url;
            
            try {
                 url = new URL(string);
            } catch (e) {
                return false;  
            }
                return true;
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

            toggelCamera () {
                switch (this.camera) {
                    case 'off':
                        this.turnCameraOn()
                        break
                    case 'auto':
                        this.turnCameraOff()
                        this.validMsg = "Camara desactivada"
                        break
                }
            },

            timeout (ms) {
                return new Promise(resolve => {
                    window.setTimeout(resolve, ms)
                })
            }
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