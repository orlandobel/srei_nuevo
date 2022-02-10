<template>
    <div class="modal fade" id="equipoModal" data-bs-backdrop="static" 
      data-bs-keyboard="false" tabindex="-1" aria-labelledby="equipoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            
            <api-message v-for="(error, index) in errores" :key="index"
                :error_bind="true" :message_bind="error" />
        
            <div class="modal-content">
                <ul class="pt-2 ps-1 nav nav-tabs" role="tablist">
                    <li class="nav-item">
                        <a href="#datos-tab" class="nav-link active" id="nav-datos-tab" data-bs-toggle="tab" >Datos</a>
                    </li>
                    <li class="nav-item" :class="{'visually-hidden': !tiene_checklist}">
                        <a href="#checklist-tab" class="nav-link" id="nav-checklist-tab" data-bs-toggle="tab" >Checklist</a>
                    </li>
                </ul>
                
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="datos-tab" role="tabpanel" aria-labelledby="nav-datos-tab" >
                        <datos ref="datos" v-on:tiene_checklist="toggle_checklist"/>
                    </div>
                    <div class="tab-pane fade" id="checklist-tab" role="tabpanel" aria-labelledby="nav-checklist-tab" >
                        <checklist />
                        
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" id="close_btn" data-bs-dismiss="modal" @click="reiniciar">Cancelar</button>
                    <button class="btn btn-success" @click="guardar">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datos from '@/components/inventarios/modaltabs/Datos.vue'
import Checklist from '@/components/inventarios/modaltabs/Checklist.vue'
import ApiMessage from '@/components/inventarios/ApiMessage.vue'
import { mapActions, mapGetters } from 'vuex'
import { guardar } from '@/api_queries/equipo'

const actions = [
    'set_id',
    'set_nombre',
    'set_imagen',
    'set_caracteristicas',
    'set_checklist',
    'toggle_checklist',
]

const getters = [
    'id',
    'nombre',
    'imagen',
    'caracteristicas',
    'tiene_checklist',
    'checklist',
    'creacion',
]

export default {
    name: 'EquipoModal',
    components: {
        Datos,
        Checklist,
        ApiMessage,
    },
    data() {
        return {
            errores: [],
        }
    },
    computed: {
        ...mapGetters('equipo_inventario', getters)
    },
    methods: {
        ...mapActions('equipo_inventario', actions),
        reiniciar() {
            const caracteristicas_template = {
                fabricante: '',
                modelo: '',
                serie: '',
                descripcion: '',
            }

            this.set_id('')
            this.set_nombre('')
            this.set_caracteristicas(caracteristicas_template)
            this.set_checklist([])
            this.set_imagen(null)
            this.toggle_checklist(false)

            this.$refs.datos.reiniciar_imagen()

            this.errores = []
        },
        async guardar() {
            const laboratorio = this.$store.getters.laboratorio

            const equipo = {
                nombre: this.nombre,
                caracteristicas: this.caracteristicas,
                disponible: true,
                estado: 0,
                laboratorio: laboratorio.id,
                tipo: this.$route.params.tipo,
                propietario: 'A4RaNBQ0L6OrDtGZuIc7',
            }

            if(!this.creacion)
                equipo.id = this.id

            if(this.tiene_checklist) {
                console.log(typeof(this.checklist))
                equipo.checklist = this.checklist
            }

            const respuesta = await guardar(equipo, laboratorio.nombre, this.imagen, this.creacion)
            console.info(respuesta)
            
            if(!respuesta.guardado) {
                document.getElementById('equipoModal').scrollTop = 0
                this.errores = respuesta.errores
            } else {
                document.getElementById("close_btn").click()
                this.reiniciar()

                this.$emit('guardado', respuesta)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
textarea {
    resize: none
}
</style>