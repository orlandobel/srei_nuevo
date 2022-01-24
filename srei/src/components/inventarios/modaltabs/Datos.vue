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
                        <input type="text" class="form-control" :value="nombre" ref="nombre_field" @input="update_nombre()" >
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-lg-4">
                    <div class="form-froup">
                        <label for="fabricante" class="form-label">Fabricante</label>
                        <input type="text" class="form-control" :value="caracteristicas.fabricante" ref="fabricante_field" @input="update_fabricante()">
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-froup">
                        <label for="modelo" class="form-label">Modelo</label>
                        <input type="text" class="form-control" :value="caracteristicas.modelo" ref="modelo_field" @input="update_modelo()" />
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="form-froup">
                        <label for="serie" class="form-label">No. de serie</label>
                        <input type="text" class="form-control" :value="caracteristicas.serie" ref="serie_field" @input="update_serie()" />
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-lg-12">
                    <div class="form-group">
                        <label for="imgaen_field" class="form">imgen</label>
                        <input type="file" name="imagen_field" id="imagen_field" ref="imagen_field"
                            class="form-control" accept="image/*" @input="update_imagen()">
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-lg-12">
                    <div class="form-group">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <textarea cols="30" rows="5" class="form-control" v-model="caracteristicas.descripcion" 
                            ref="descripcion_field" @input="update_descripcion()" />
                    </div>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col-lg-12">
                    <div class="form-check">
                        <input type="checkbox" id="checklist" class="form-check-input" v-model="tiene_checklist" :readonly="false" @change="toggle()">
                        <label for="checklist" class="form-check-label">Crear checklist</label>
                    </div>
                </div>
            </div>

            <input type="hidden" name="laboratorio" :value="usuario.laboratorio">
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

const actions = [
    'set_nombre',
    'set_imagen',
    'set_fabricante',
    'set_modelo',
    'set_serie',
    'set_descripcion',
    'toggle_checklist',
]

export default {
    name: 'Datos',
    data() {
        return {
            
        }
    },
    computed: {
        ...mapGetters('equipo_inventario', ['nombre', 'caracteristicas', 'imagen', 'tiene_checklist']),
        usuario: function() {
            return this.$store.getters.usuario
        },
    },
    methods: {
        ...mapActions('equipo_inventario', actions),
        toggle() {
            const existe = !this.tiene_checklist
            this.toggle_checklist(existe)
        },
        update_nombre() {
            this.set_nombre(this.$refs.nombre_field.value)
        },
        update_imagen() {
            const imagen = this.$refs.imagen_field.files[0]

            console.log(imagen.buffer)
            const img = {
                lastModified: imagen.lastModified,
                lastModifiedDate: imagen.lastModifiedDate,
                name: imagen.name,
                size: imagen.size,
                type: imagen.type,
                webkitRelativePath: imagen.webkitRelativePath,
            }    

            this.set_imagen(imagen)
            /*const reader = new FileReader()
            reader.onload = () => {
                const dataURL = reader.result

                console.log(dataURL)
            }

            reader.readAsDataURL(img)*/
        },
        update_fabricante() {
            this.set_fabricante(this.$refs.fabricante_field.value)
        },
        update_modelo() {
            this.set_modelo(this.$refs.modelo_field.value)
        },
        update_serie() {
            this.set_serie(this.$refs.serie_field.value)
        },
        update_descripcion() {
            this.set_descripcion(this.$refs.descripcion_field.value)
        },
    }
    
}
</script>