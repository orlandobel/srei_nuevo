<template>
    <div class="row overflow-hidden">
        <QRScanner ref="qrComponent" @addPrestamo="addEquipo($event)" @addAlumnos="addAlumno($event)"/>
        <div class="col-lg-7">
            <!-- Lado izquierdo de la cabezera de la sección -->
            <div class="row header pd-1">
                <div class="col-9 d-flex">
                    <b class="h3 align-self-center fw-bolder me-4">Prestamos</b>
                    <button v-on:click="this.$refs.qrComponent.camera = 'auto'"
                        type="button" class="btn btn-outline-secondary icon-button"
                        data-bs-toggle="modal" data-bs-target="#scanModal">
                            <fa-icon :icon="['fas','qrcode']" size="2x"/>
                    </button>
                </div>
                <div class="col-3" v-if="laboratorio.edificio.includes('Ligeros')">
                    <select class="form-select" id="mesas">
                        <option disabled selected value="">Seleccione una mesa</option>
                        <option v-for="m in mesas" :key="m._id" :value="m.nombre">{{ m.nombre }}</option>
                    </select>
                </div>
            </div>
            <!-- Fin del lado izquierdo de la cabezera -->

            <!-- Lista de los materiales que se prestarán a los alumnos -->
            <div class="row list-wrapper">
                <div class="col-12 py-2 px-2 h-100 mh-100">
                    <ul class="list-group list-group-flush p-2 border border-dark rounded-3 h-100 mh-100 overflow-auto col-12">
                        <h5 class="text-start fw-bold ps-3 border-bottom border-secondary">Materiales</h5>

                        <li class="list-group-item align-items-start">
                            <div class="row ">
                                <div class="col-lg-4 fw-bold">Nombre</div>
                                <div class="col-lg-2 fw-bold">Fabricante</div>
                                <div class="col-lg-2 fw-bold">Modelo</div>
                                <div class="col-lg-2 fw-bold">No. serie</div>
                                <div class="col-lg-2 fw-bold">Remover</div>
                            </div>
                        </li>

                        <equipo-list-element v-for="(eq, index) in equipos" :key="eq._id"
                            :equipo="eq" :index="index"
                            @remover="removerEquipo($event)" />
                    </ul>
                </div>
            </div>
            <!-- Fin de la lista de los materiales -->
        </div>

        <div class="col-lg-5">
            <!-- Lado derecho de la cabezera de la sección -->
            <div class="row mb-2 header">
                <div class="input-group">
                    <input type="text" name="boleta" id="boleta" placeholder="Boleta"
                        class="form-control dropdown-toggle" autocomplete="off"
                        data-bs-toggle="dropdown" aria-expanded="false"
                        @input="filtrarAlumnos()"
                        ref="alumnosSearchField">
                    <span class="input-group-text">
                        <fa-icon :icon="['fas','user-plus']" />
                    </span>

                    <ul class="dropdown-menu">
                        <li v-for="alumno in alumnos_filtrados" :key="alumno._id">
                            <a class="dropdown-item" href="#"
                                @click="buscar(alumno)">{{ alumno.nombre }} | {{ alumno.usuario }}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Fin del lado derecho de la cabezera -->

            <!-- Lista de los alumnos que ocupan una mesa -->
            <div class="row alumnos-wrapper w-100 mw-100">
                <ul class="list-group list-group-flush p-2 border border-dark rounded-3 h-100 mh-100 overflow-auto">
                    <h5 class="text-start ps-3 fw-bold border-bottom border-secondary">Alumnos en mesa</h5>

                    <li class="list-group-item align-items-start me-2">
                            <div class="row">
                                <div class="col-lg-7 fw-bold">Nombre</div>
                                <div class="col-lg-4 text-center fw-bold">Boleta</div>
                                <div class="col-lg-1 fw-bold"></div>
                            </div>
                        </li>

                    <alumno-list-element 
                        v-for="(al, index) in alumnos" :key="al._id" 
                        :alumno="al" :index="index"
                        @remover="removerAlumno($event)" />
                </ul>
            </div>
            <!-- Fin de la lista de alumnos -->

            <!-- Botonera de acciones de la sección --> 
            <div class="row pt-3 justify-content-end">
                <div class="col-3">
                    <button class="btn btn-danger" @click="borrarPrestamo()">Cancelar</button>
                </div>
                <div class="col-3">
                    <button class="btn btn-primary align-self-end" @click="enviarPrestamo()">Guardar</button>
                </div>
            </div>
            <!-- Fin de la boronera -->
        </div>
    </div>
</template>

<script>
import EquipoListElement from '@/components/tabulaciones-inicio/prestamos/PrestamosListElements/EquipoListElement.vue';
import AlumnoListElement from '@/components/tabulaciones-inicio/prestamos/PrestamosListElements/AlumnoListElement.vue';
import ApiMessage from '@/components/ApiMessage.vue';
import QRScanner from '@/components/tabulaciones-inicio/ScanRelated/QRScanner.vue'
import { mapActions } from 'vuex';
import  { generarPrestamo, verificarVetado } from '@/api_queries/prestamos';
import { listarMesas } from '@/api_queries/laboratorios.js';
import { listarAlumnos } from '@/api_queries/usuarios.js';

export default {
    name: 'PrestamosTab',
    components: {
        QRScanner,
        EquipoListElement,
        AlumnoListElement,
        ApiMessage,
    },
     data () {
        return {
            equipos: [],
            alumnos: [],
            alumnos_busqueda: [],
            alumnos_filtrados: [],
            mesas: [],
            success: false,
            error: false,
            errors: [],
            laboratorio: this.$store.getters.laboratorio,
        }
    },
    methods: {
        ...mapActions('laboratorio_store', ['addPrestamo', 'addAlumnosMesa']),
        addEquipo(equipo) {
            if(!this.equipos.some(e => e._id === equipo._id))
                this.equipos.push(equipo);
        },
        removerEquipo(index) {
            this.equipos.splice(index, 1);
        },
        addAlumno(alumno) {
            if(!this.alumnos.some(a => a.usuario === alumno.usuario))
                this.alumnos.push(alumno);
        },
        removerAlumno(index) {
            this.alumnos.splice(index, 1);
        },
        borrarPrestamo() {
            this.equipos = [];
            this.alumnos = [];

            const mesa_selector = document.getElementById('mesas');
            mesa_selector.options[0].selected = 'selected';
        },
        async enviarPrestamo() {
            try {
                const alumnos = this.alumnos;
                const equipo = this.equipos;
                const mesa = (this.laboratorio.edificio.includes('Ligeros')) ? document.getElementById('mesas').value : null;
                
                const prestamo = {
                    alumnos,
                    equipo,
                    laboratorio: this.laboratorio._id,
                    mesa,
                };
                
                const res = await generarPrestamo(prestamo);

                this.addPrestamo(res.prestamo);

                if(this.laboratorio.nombre.includes("Electronica")) {
                    this.addAlumnosMesa(res.mesa);
                }

                this.borrarPrestamo();
            } catch(error) {
                console.log(error)
                this.$emit('erroresPrestamo', error);;
            }
        },
        filtrarAlumnos() {
            const filtro = this.$refs.alumnosSearchField.value;
            
            this.alumnos_filtrados = this.alumnos_busqueda.filter(
                a => a.usuario.includes(filtro));
        },
        async buscar(alumno) {
            const vetado = await verificarVetado(alumno, this.laboratorio._id)

            if(vetado)
                this.$emit("erroresPrestamo", ['Alumno vetado del laboratorio'])
            else 
                this.addAlumno(alumno);
        }
    },
    mounted() {
        listarAlumnos().then(res => {
            this.alumnos_busqueda = res;
            this.alumnos_filtrados = res;
        }).catch(error => this.$emit('erroresPrestamo', error));

        listarMesas(this.laboratorio._id).then(res => {
            this.mesas = res;
        }).catch(error => this.$emit('erroresPrestamo', error));
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.list-wrapper {
    --heigth: 19.5cm;
}

.alumnos-wrapper {
    --height-alumnos: 19.1cm;
}

@media screen and ( max-height: 1080px ) {
    .list-wrapper {
        --heigth: 18.4cm;
    }   

    .alumnos-wrapper {
        --height-alumnos: 18cm;
    }
}

.list-wrapper {
    height: var(--heigth);
    max-height: var(--heigth);
}

.alumnos-wrapper {
    height: var(--height-alumnos);
    max-height: var(--height-alumnos);
}

.icon-button {
    padding: 1px 5px;
}

.header {
    height: 5%;
    max-height: 5%;
}

</style>