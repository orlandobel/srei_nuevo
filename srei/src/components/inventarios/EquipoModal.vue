<template>
    <div class="modal fade mh-75 h-75" id="equipoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="equipoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
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
                        <datos v-on:tiene_checklist="toggle_checklist"/>
                    </div>
                    <div class="tab-pane fade" id="checklist-tab" role="tabpanel" aria-labelledby="nav-checklist-tab" >
                        <checklist />
                        
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" data-bs-dismiss="modal" @click="reiniciar">Cancelar</button>
                    <button class="btn btn-success">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datos from '@/components/inventarios/modaltabs/Datos.vue'
import Checklist from '@/components/inventarios/modaltabs/Checklist.vue'
import { mapActions, mapGetters } from 'vuex'

const actions = [
    'set_nombre',
    'set_caracteristicas',
    'set_checklist',
    'toggle_checklist',
]

export default {
    name: 'EquipoModal',
    components: {
        Datos,
        Checklist,
    },
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters('equipo_inventario', ['tiene_checklist'])
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

            this.set_nombre('')
            this.set_caracteristicas(caracteristicas_template)
            this.set_checklist([])
            this.toggle_checklist(false)
        }
    }
}
</script>

<style lang="scss" scoped>
textarea {
    resize: none
}
</style>