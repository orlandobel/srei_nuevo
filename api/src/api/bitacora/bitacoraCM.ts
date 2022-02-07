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
export default class BitacoraCM {

    // variables de acceso a db
    private db = admin.firestore();

    //agregar referencias para agregar 
    private refEqp = this.db.collection(variable['equipo']);
    
    // Endpoint para conocer la disponibilidad de un equipo .
    public verDisponibilidadEQP = async (equipo: string) => {
        if (equipo === undefined || equipo === null || equipo === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        let registro = await this.refEqp.doc(equipo).get()
            .then(data => {
                if (data.exists) {
                    const document = data.data() as EQP;
                    return document.disponible;
                }else{
                    return new DataNotFoundException(codigos.datoNoEncontrado);
                } 
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado);
            });
        return registro;
    }
}