<template>
    <div>
        <div class="modal-header">
            <h5 class="modal-title">Checklist</h5>
            <input type="number" v-on:input="update_list()" v-model="checklist_length" min="0">
        </div>

        <div class="modal-body text-start h-25 mh-25">
            <input type="text" class="form-control mb-2" v-for="(_, index) in checklist_fields" :key="index" v-model="checklist_fields[index]">
        </div>
    </div>   
</template>

<script>
export default {
    name: 'Checklist',
    data() {
        return {
            checklist_length : 0,
            checklist_fields: []
        }
    },
    methods: {
        add_item(dif) {
            for(let i=0; i< dif; i++)
                this.checklist_fields.push('')
        },
        delete_item(start, end) {
            this.checklist_fields.splice(start, end); 
        },
        update_list() {
            const current_length = this.checklist_fields.length

            if(this.checklist_length > current_length) {
                const dif = this.checklist_length - current_length
                this.add_item(dif)
            } else {
                const end = current_length - this.checklist_length
                this.delete_item(this.checklist_length, end)
            }

        },
    },
    mounted() {
        this.delete_item()
    }
}
</script>

