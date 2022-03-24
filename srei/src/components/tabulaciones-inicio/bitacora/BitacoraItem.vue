<template>
<li class="list-group-item align-items-start p-0 border-bottom">
        <ul class="list-group w-100 list-group-flush">
            <li class="list-group-item border-0">
                <ul class="list-group list-group-horizontal w-100">
                    
                        <li class="list-group-item w-25 border-0 border-end" role="button"
                            data-bs-toggle="collapse" :data-bs-target="'#collapse-'+index"
                            aria-expanded="false" :aria-controls="'#collapse-'+index"
                            v-if="prestamo.mesa != null && prestamo.mesa != undefined">
                                {{ prestamo.mesa }}
                        </li>
                        <li class="list-group-item w-25 border-0 border-end" role="button"
                            data-bs-toggle="collapse" :data-bs-target="'#collapse-'+index"
                            aria-expanded="false" :aria-controls="'#collapse-'+index">
                                {{ prestamo.alumnos.length }}
                        </li>
                        <li class="list-group-item w-25 border-0 border-end" role="button"
                            data-bs-toggle="collapse" :data-bs-target="'#collapse-'+index"
                            aria-expanded="false" :aria-controls="'#collapse-'+index">
                                {{ prestamo.equipo.length }}
                        </li>
                        <li class="list-group-item w-25 border-0 border-end" role="button"
                            data-bs-toggle="collapse" :data-bs-target="'#collapse-'+index"
                            aria-expanded="false" :aria-controls="'#collapse-'+index">
                                {{ hora_prestamo  }}
                        </li>
                        <li class="list-group-item w-25 border-0 border-end" role="button"
                            data-bs-toggle="collapse" :data-bs-target="'#collapse-'+index"
                            aria-expanded="false" :aria-controls="'#collapse-'+index">
                                {{ hora_devolucion }}
                        </li>
                    
                        <li class="list-group-item w-25 border-0">
                            <button class="btn btn-primary" :class="!prestamo.activo ? 'disabled' : '' "
                                @click="regresar()">Entregar</button>
                        </li>
                    </ul>
            </li>

            <li class="collapse list-group-item w-100 align-items-start m-0 p-0" :id="'collapse-'+index">
                <ul class="list-group list-group-horizontal w-100 text-start pb-2">
                    <li class="list-group-item w-75 border-0 border-end">
                        <ul class="list-group">
                            <li class="list-group-item d-flex border-0 justify-content-between" v-for="alumno in prestamo.alumnos" :key="alumno._id">
                                <span> {{ alumno.nombre }} </span>
                                <span> <b>|</b> </span>
                                <span> {{ alumno.usuario }} </span>
                                <span> <b>|</b> </span>
                                <span> {{ alumno.programa }} </span>
                            </li>
                        </ul>
                    </li>

                    <li class="list-group-item w-25 border-0 border-end">
                        <ul class="list-group">
                            <li class="list-group-item border-0" v-for="e in prestamo.equipo" :key="e._id">
                                {{ e.nombre }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
</li>
    
</template>

<script>
import { regresarPrestamo } from '@/api_queries/prestamos';

export default {
    name: 'BitacoraItem',
    props: {
        prestamo_prop: { type: Object, required: true },
        index: { type: Number, required: true }
    },
    data() {
        return {
            prestamo: this.prestamo_prop,
        }
    },
    computed: {
        hora_prestamo() {
            const date = new Date(this.prestamo.creado)

            return date.toLocaleTimeString();
        },
        hora_devolucion() {
            if(this.prestamo.activo)
                return '-';

            const date = new Date(this.prestamo.actualizado)

            return date.toLocaleTimeString();
        },
    },
    methods: {
        regresar() {
            const self = this;
            regresarPrestamo(this.prestamo._id)
                .then(res => {
                    self.prestamo = res;
                })
                .catch(errtor => console.error(errtor));
        }
    }
}
</script>