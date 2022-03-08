<template>
<li class="list-group-item align-items-start p-0 border-bottom">
        <ul class="list-group w-100 list-group-flush">
            <li class="list-group-item border-0">
                <a class="text-decoration-none w-100" data-bs-toggle="collapse" :href="'#collapse-'+index" role="button" aria-expanded="false" aria-controls="collapseExample">
                    <ul class="list-group list-group-horizontal w-100">
                        <li class="list-group-item w-25 border-0 border-end">{{ prestamo.mesa }}</li>
                        <li class="list-group-item w-25 border-0 border-end">{{ prestamo.alumnos.length }}</li>
                        <li class="list-group-item w-25 border-0 border-end">{{ prestamo.equipo.length }}</li>
                        <li class="list-group-item w-25 border-0 border-end">{{ hora_prestamo  }}</li>
                        <li class="list-group-item w-25 border-0 border-end">{{ hora_devolucion }}</li>
                        <li class="list-group-item w-25 border-0">
                            <button class="btn btn-primary" :class="!prestamo.activo ? 'disabled' : '' " >Entregar</button>
                        </li>
                    </ul>
                </a>
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
export default {
    name: 'BitacoraItem',
    props: {
        prestamo: { type: Object, required: true },
        index: { type: Number, required: true }
    },
    computed: {
        hora_prestamo() {
            const timestamp = this.prestamo.creado;
                 
            const hora_mongo = timestamp.split('T')[1];
            const hora = hora_mongo.split('.')[0];

            return hora;
        },
        hora_devolucion() {
            if(this.prestamo.activo)
                return '-';

            const timestamp = this.prestamo.actualizado;
                 
            const hora_mongo = timestamp.split('T')[1];
            const hora = hora_mongo.split('.')[0];

            return hora;
        }
    }
}
</script>