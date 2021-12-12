<template>
    <div>
        <div class="modal-header">
            <h5 class="modal-title" id="equipoModalLabel">Modal de equipo</h5>
        </div>

        <div class="modal-body text-start">
            <div class="row mb-2">
                <div class="col-lg-12">
                    <div class="form-group">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" name="nombre" id="nombre" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-lg-4">
                    <div class="form-froup">
                        <label for="fabricante" class="form-label">Fabricante</label>
                        <input type="text" name="fabricante" id="fabricante" class="form-control">
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-froup">
                        <label for="modelo" class="form-label">Modelo</label>
                        <input type="text" name="modelo" id="modelo" class="form-control">
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-froup">
                        <label for="serie" class="form-label">No. de serie</label>
                        <input type="text" name="serie" id="serie" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-lg-12">
                    <div class="form-group">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <textarea name="descripcion" id="descripcion" cols="30" rows="5" class="form-control"></textarea>
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-lg-12">
                    <div class="form-check">
                        <input type="checkbox" name="checklist" id="checklist" class="form-check-input" v-model="checklist" @change="toggle(this.checklist)">
                        <label for="checklist" class="form-check-label">Crear checklist</label>
                    </div>
                </div>
            </div>

            <input type="hidden" name="laboratorio" value="{{usuario.laboratorio}}">
        </div>
    </div>
</template>

<script>
export default {
    naem: 'Datos',
    props: ['tiene_checklist'],
    data() {
        return {
            checklist: false
        }
    },
    computed: {
        usuario: function() {
            return this.$store.getters.usuario
        },
    },
    methods: {
        toggle: function (value) {
            this.$emit('tiene_checklist', value)
        }
    }
    
}
</script>