<template>
    <div>
        <div class="modal-header">
            <h5 class="modal-title">Checklist</h5>
            <input type="number" @click="update_list()" @keypress.enter="update_list()" v-model="checklist_length" min="0">
        </div>

        <div class="modal-body text-start h-25 mh-25">
            <div class="row" v-for="(_, index) in checklist" :key="index">
                <div class="col-6 col-lg-10">
                    <input type="text" class="form-control mb-2"  
                    v-model="checklist[index].nombre">
                </div>
                <div class="col-6 col-lg-2 fomr-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch"
                        v-model="checklist[index].estatus" />
                </div>
            </div>
        </div>
    </div>   
</template>

<script>
import {  mapActions, mapGetters } from 'vuex'

export default {
    name: 'Checklist',
    data() {
        return {
            checklist_length: 0,
        }
    },
    computed: {
        ...mapGetters('equipo_inventario', ['checklist'])
    },
    methods: {
        ...mapActions('equipo_inventario', ['add_checklist_element', 'remove_checklist_elements']),
        update_list() {
            const current_length = this.checklist.length

            if(this.checklist_length > current_length) {
                const dif = this.checklist_length - current_length
                for(let i=0; i< dif; i++)
                    this.add_checklist_element()
            } else {
                const end = current_length - this.checklist_length
                this.remove_checklist_elements({start: this.checklist_length, end})
            }

        },
        reiniciar() {
            this.checklist_length = 0;
        }
    }
}
</script>

