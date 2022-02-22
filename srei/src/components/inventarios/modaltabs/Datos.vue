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
                    <div class="form-group mb-2">
                        <label for="imgaen_field" class="form">imgen</label>
                        <input type="file" name="imagen_field" id="imagen_field" ref="imagen_field"
                            class="form-control" accept="image/*" @input="update_imagen()">
                    </div>

                    <img v-bind:src="this.imagen_src ?? sin_imagen" 
                        id="imagen_equipo"
                        width="200" height="200" ref="imagen_equipo"
                        class="img-thumbnail"
                        alt="Error de lectura" >

                    <canvas id="img_canvas" 
                        width="200" height="200"
                        class="img-thumbnail" hidden></canvas>
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
    'set_imagen_src',
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
            sin_imagen: require('../../../assets/inventario/fondo_imagen_equipo.png'),
        }
    },
    computed: {
        ...mapGetters('equipo_inventario', ['nombre', 'caracteristicas', 'imagen', 'imagen_src', 'tiene_checklist']),
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

            this.set_imagen(imagen)

            const reader = new FileReader()
            reader.onload = () => {
                const dataURL = reader.result

                this.$refs.imagen_equipo.src = dataURL
                this.set_canvas(dataURL)
            }

            reader.readAsDataURL(imagen)
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
        reiniciar_imagen() {
            this.$refs.imagen_field.value = null
            this.$refs.imagen_equipo.src = require('../../../assets/inventario/fondo_imagen_equipo.png')

            this.set_imagen(null)
            this.set_imagen_src(null)
            this.set_canvas(null)
        },
        set_canvas(img) {
            const canvas = document.getElementById('img_canvas')
            const ctx = canvas.getContext('2d')

            const base_img = new Image();
            base_img.onload = function() {
                console.log('rendering image')
                ctx.clearRect(0, 0, 200, 200)
                ctx.drawImage(base_img, 0, 0, 200, 200)
            }

            if(img === null ){
                base_img.src = this.sin_imagen;
            } else if(img.includes('data:image')) {
                base_img.src = img;
            } else {
                console.log('working in')
                const blob = new Blob([img])
                const url = URL.createObjectURL(blob)
                base_img.src = url
            }
        }
    },
    mounted() {
        this.set_canvas(null)
    },
    updated() {
        console.log(this.imagen_src)
        this.set_canvas(this.imagen_src)
    }
}
</script>