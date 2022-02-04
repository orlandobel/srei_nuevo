/*
 *   Versión 1.0
 *   Creado al 04/02/2022
 *   Creado por: GBautista
 *   Copyright SReI
 */

import * as admin from 'firebase-admin';
import { variable } from '../variables';
import { codigos } from '../../exceptions/codigos';

// import de exceptions
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

// import de interfaces
import EQP from '../../interfaces/colecciones/EQP.interface';

// client manager, contiene toda la logica del manejo de los datos
export default class BitacotaCM {

    // variables de acceso a db
    private db = admin.firestore();

    //agregar referencias para agregar 
    private refEqp = this.db.collection(variable['equipo']);

    // en caso de referencia imagen descomentar el bucket
    //private bucket = admin.storage().bucket('gs://srei-dc583.appspot.com/'); // 'gs://srei-dc583.appspot.com/'

    // Endpoint para conocer la disponibilidad de un equipo .
    public verDisponibilidadEQP = async (equipo: string) => {
        if (equipo === undefined || equipo === null || equipo === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        const registro = await this.refEqp.doc(equipo).get()
            .then(data => {
                if (data.exists) {
                    const document = data.data() as EQP;
                    if (document.disponible) return true;
                    return false;
                }
                return new DataNotFoundException(codigos.equipoNoEncontrado);
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado);
            });
        return registro;
    }

    // Endpoint para conocer la disponibilidad de un grupo de equipos
    public equiposDisponibles = async (equipos: [string]) => {
        //funcion arrow para ver tipo de dato
        const checkRegistro = (registro: any) => typeof registro;
        //if check nulos
        if (equipos === undefined || equipos === null) {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        //leo todos los registros 
        const registros = equipos.map((equipo) => await this.verDisponibilidadEQP(equipo));
        //check en caso de error
        const errorRegistro = registros.find(equipo => checkRegistro(equipo) == "object" );
        //en caso de no encontrar error buscar un false
        if (errorRegistro === undefined){
            let retorno = null;
            registros.some( (registro) => {
                if (registro == false){
                    retorno = new DataNotFoundException(codigos.equipoNoEncontrado); 
                }
                    // este check tiene que escribirse así por semántica
            })
            if (retorno = null) return registros
            else return retorno
        }else{
            return errorRegistro
        }
    }


}


