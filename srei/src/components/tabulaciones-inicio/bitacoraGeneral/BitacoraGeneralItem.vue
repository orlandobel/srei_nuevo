<template>
    <li class="list-group-item d-flex align-items-start">
        <bitacora-equipo-modal :equipos="equipos" :fecha="fecha" />
        <bitacora-alumnos-modal :alumnos="alumnos" :fecha="fecha" />
        <ul class="list-group list-group-horizontal w-100">
            <li class="list-group-item w-100 border-0 border-end">
                    {{ alumnos[0].nombre.toLowerCase().replace(/\w\S*/g, (w) => (
                        w.replace(/^\w/, (c) => c.toUpperCase())
                        )) }}
                    <br/>
                    {{alumnos[0].usuario}}
            </li>
            <li class="list-group-item w-25 border-0 border-end">{{ mesa }}</li>
            <li class="list-group-item w-50 border-0 border-end">{{ fecha.split("T")[0] }}</li>
            <li class="list-group-item w-50 border-0 border-end">{{ fecha.split("T")[1].split('.')[0] }}</li>
            <li class="list-group-item w-50 border-0 border-end">{{ prestamo.split("T")[0] }}</li>
            <li class="list-group-item w-50 border-0 border-end">{{ prestamo.split("T")[1].split('.')[0] }}</li>
            <li class="list-group-item w-50 border-0">
                <button class="btn btn-outline-primary" type="button" data-bs-toggle="modal" data-bs-target="#equiposModal">Ver Equipos</button>
                <hr/>
                <button class="btn btn-outline-info" type="button" data-bs-toggle="modal" data-bs-target="#alumnosModal">Encargados</button>
            </li>
        </ul>
    </li>
</template>

<script>
import BitacoraEquipoModal from '@/components/tabulaciones-inicio/bitacoraGeneral/BitacoraEquipoModal.vue'
import BitacoraAlumnosModal from '@/components/tabulaciones-inicio/bitacoraGeneral/BitacoraAlumnosModal.vue'
export default {
    name: 'BitacoraGeneralItem',
    components: {
        BitacoraEquipoModal,
        BitacoraAlumnosModal 
    },
    props: {
        alumnos: { type: Array, required: true },
        mesa: { type: String, required: false, default: '' },
        fecha: { type: String, required: false, default: '' },
        prestamo: { type: String, required: false, default: '' },
        equipos: { type: Array, required: true },
    },
}
</script>