<template>
    <div class="row overflow-hidden">
        <QRScanner />

        <div class="col-lg-8">
            <!-- Lado izquierdo de la cabezera de la sección -->
            <div class="row header pd-1">
                <div class="col-9 d-flex">
                    <b class="h3 align-self-center fw-bolder me-4">Prestamos</b>
                    <button type="button" class="btn btn-outline-secondary icon-button" data-bs-toggle="modal" data-bs-target="#scanModal">
                        <fa-icon :icon="['fas','qrcode']" size="2x"/>
                    </button>
                </div>
                <div class="col-3">
                    <select class="form-select">
                        <option value="" disabled selected>Seleccione una mesa</option>
                        <option value="">Mesa 1</option>
                        <option value="">Mesa 2</option>
                        <option value="">Mesa 3</option>
                    </select>
                </div>
            </div>
            <!-- Fin del lado izquierdo de la cabezera -->

            <!-- Lista de los materiales que se prestarán a los alumnos -->
            <div class="row list-wrapper">
                <div class="col-12 py-2 px-2 h-100 mh-100">
                    <ul class="list-group list-group-flush p-2 border border-dark rounded-3 h-100 mh-100 overflow-auto ">
                        <h5 class="text-start fw-bold ps-3 border-bottom border-secondary">Materiales</h5>
                        <prestamos-list-element nombre="Elemento 1" />
                        <prestamos-list-element nombre="Elemento 2" />
                        <prestamos-list-element nombre="Elemento 3" />
                        <prestamos-list-element nombre="Elemento 4" />
                        <prestamos-list-element nombre="Elemento 5" />
                        <prestamos-list-element nombre="Elemento 6" />
                        <prestamos-list-element nombre="Elemento 6" />
                        <prestamos-list-element nombre="Elemento 6" />
                        <prestamos-list-element nombre="Elemento 6" />
                        <prestamos-list-element nombre="Elemento 7" />
                        <prestamos-list-element nombre="Elemento 8" />
                        <prestamos-list-element nombre="Elemento 9" />
                        <prestamos-list-element nombre="Elemento 10" />
                        <prestamos-list-element nombre="Elemento 11" />
                        <prestamos-list-element nombre="Elemento 12" />
                        <prestamos-list-element nombre="Elemento 13" />
                        <prestamos-list-element nombre="Elemento 14" />
                        <prestamos-list-element nombre="Elemento 14" />
                        <prestamos-list-element nombre="Elemento 14" />
                        <prestamos-list-element nombre="Elemento 14" />
                        <prestamos-list-element nombre="Elemento 14" />
                        <prestamos-list-element nombre="Elemento 14" />
                        <prestamos-list-element nombre="Elemento 14" />
                    </ul>
                </div>
            </div>
            <!-- Fin de la lista de los materiales -->
        </div>

        <div class="col-lg-4">
            <!-- Lado derecho de la cabezera de la sección -->
            <div class="row mb-2 header">
                <div class="input-group">
                    <input type="text" name="boleta" id="boleta" placeholder="Boleta" class="form-control">
                    <span class="input-group-text">
                        <fa-icon :icon="['fas','user-plus']" />
                    </span>
                </div>
            </div>
            <!-- Fin del lado derecho de la cabezera -->

            <!-- Lista de los alumnos que ocupan una mesa -->
            <div class="row alumnos-wrapper w-100 mw-100">
                <ul class="list-group list-group-flush p-2 border border-dark rounded-3 h-100 mh-100 overflow-auto">
                    <h5 class="text-start ps-3 fw-bold border-bottom border-secondary">Alumnos en mesa</h5>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                    <prestamos-list-element nombre="Orlando Odiseo Belmonte Flores" boleta="2018671281"/>
                </ul>
            </div>
            <!-- Fin de la lista de alumnos -->

            <!-- Botonera de acciones de la sección --> 
            <div class="row pt-3 justify-content-end">
                <div class="col-3">
                    <button class="btn btn-danger">Cancelar</button>
                </div>
                <div class="col-3">
                    <button class="btn btn-primary align-self-end">Guardar</button>
                </div>
            </div>
            <!-- Fin de la boronera -->
        </div>
    </div>
</template>

<script>
import PrestamosListElement from '@/components/tabulaciones-inicio/PrestamosListElement.vue'
import QRScanner from '@/components/tabulaciones-inicio/ScanRelated/QRScanner.vue'


export default {
    name: 'PrestamosTab',
    components: { 
        PrestamosListElement,
        QRScanner,
        
        },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.list-wrapper {
    height: 19.5cm;
    max-height: 19.5cm;
}

.alumnos-wrapper {
    height: 19.1cm;
    max-height: 19.1cm;
}

.icon-button {
    padding: 1px 5px;
}

.header {
    height: 5%;
    max-height: 5%;
}
</style>