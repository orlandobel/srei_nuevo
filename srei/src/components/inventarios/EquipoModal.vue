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
                    <li class="nav-item" :class="{'visually-hidden': !getTieneChecklist}">
                        <a href="#checklist-tab" class="nav-link" id="nav-checklist-tab" data-bs-toggle="tab" >Checklist</a>
                    </li>
                </ul>
                
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="datos-tab" role="tabpanel" aria-labelledby="nav-datos-tab" >
                        <datos ref="datos" v-on:getTieneChecklist="toggle_checklist" />
                    </div>
                    <div class="tab-pane fade" id="checklist-tab" role="tabpanel" aria-labelledby="nav-checklist-tab" >
                        <checklist ref="checklistTab" />
                        
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
            laboratorio: this.$store.getters.laboratorio,
        }
    },
    computed: {
        ...mapGetters('equipo_inventario', getters),
        ...mapGetters('equipo_inventario', {
            getTieneChecklist: 'tiene_checklist',
        }),
    },
    methods: {
        ...mapActions('equipo_inventario', actions),
        reiniciar() {
            const caracteristicas_template = {
                fabricante: '',
                modelo: '',
                serie: '',
                descripcion: '',
                laboratorio: this.laboratorio,
            };

            this.set_id('');
            this.set_nombre('');
            this.set_caracteristicas(caracteristicas_template);
            this.set_checklist([]);
            this.set_imagen(null);
            this.toggle_checklist(false);

            this.$refs.datos.reiniciar_imagen();
            this.$refs.checklistTab.reiniciar();

            this.errores = [];
        },
        async guardar() {

            const equipo = {
                nombre: this.nombre,
                caracteristicas: this.caracteristicas,
                disponible: true,
                estado: 0,
                laboratorio: this.laboratorio._id,
                tipo: this.$route.params.tipo,
                propietario: 'A4RaNBQ0L6OrDtGZuIc7',
            }

            if(!this.creacion)
                equipo._id = this.id

            if(this.getTieneChecklist) {
                equipo.checklist = this.checklist
            }

            console.log(equipo);
            console.log()

            const respuesta = await guardar(equipo, this.laboratorio.nombre, this.imagen, this.creacion)
            respuesta.crear = this.creacion
            
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