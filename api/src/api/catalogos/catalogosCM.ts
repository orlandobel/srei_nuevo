/*
 *   Versión 1.1
 *   Creado al 10/09/2020
 *   Creado por: IBelmonte
 *   Modificado al: 23/10/2020
 *   Editado por: GBautista
 *   Copyright SReI
 */

import * as admin from 'firebase-admin';
import { variable } from '../variables';
import { codigos } from '../../exceptions/codigos';
const QRCode = require('qrcode');

// import de exceptions
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

// import de interfaces
import EQP from '../../interfaces/colecciones/EQP.interface';

// client manager, contiene toda la logica del manejo de los datos
export default class CatalogosCM {
    // variables de acceso a db
    private db = admin.firestore();
    private refEqp = this.db.collection(variable['equipo']);
    private bucket = admin.storage().bucket('gs://srei-dc583.appspot.com/'); // 'gs://srei-dc583.appspot.com/'

    // Endpoint para retornar un registro de la coleccion EQP.
    public obtenerEquipo = async (equipo: string) => {
        if (equipo === undefined || equipo === null || equipo === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        const registro = await this.refEqp.doc(equipo).get()
            .then(data => {
                if (data.exists) {
                    const document = data.data() as EQP;
                    return document;
                }
                return new DataNotFoundException(codigos.datoNoEncontrado);
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado);
            });
        return registro;
    }

    // Endpoint para retornar subcoleccion de la coleccion EQP por tipo.
    public obtenerEquipoTipo = async (tipo: string, lab: string) => {
        const elements: EQP[]| PromiseLike<EQP[]> = [];

        if (tipo === undefined || tipo === null || tipo === '') {
            return new DataNotFoundException(codigos.identificadorInvalido);
        }

        if (lab === undefined || lab === null || lab === '') {
            return new DataNotFoundException(codigos.identificadorInvalido);
        }
        
        const registro = await this.refEqp.where("tipo","==",tipo).where('laboratorio', '==', lab).get()
            .then(data => {
                if (!data.empty){
                    for (let index = 0; index < data.size; index++) {
                        if (data.docs[index].exists){
                            elements[index] = data.docs[index].data() as EQP;
                        }else{
                            return new DataNotFoundException(codigos.datoNoEncontrado);
                        }
                    }
                    return elements;
                }
                return new DataNotFoundException(codigos.datoNoEncontrado);
            }).catch(err=>{
                return new InternalServerException(codigos.datoNoEncontrado, err);
            });
        return registro;
    }

    // Endpoint para editar un registro de la coleccion EQP.
    public editarEquipo = async (equipo: EQP) => {
        if (equipo === undefined || equipo === null) {
            return new DataNotFoundException(codigos.datosNoEncontrados);
        }
        const key = equipo.id;
        const existe = await this.obtenerEquipo(key);
        if (existe instanceof DataNotFoundException) {
            return existe;
        }
        if (existe instanceof InternalServerException) {
            return existe;
        }
        const actual = admin.firestore.Timestamp.now().toDate(); // obtener hora y fecha del servidor
        equipo.actualizado = actual;
        const editado = await this.refEqp.doc(key).update(equipo)
            .then(async () => {
                const document = await this.obtenerEquipo(key);
                return document;
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado, err);
            });
        return editado;
    }

    // Endpoint para eliminar un registro de la coleccion EQP.
    public eliminarEquipo = async (equipo: string) => {
        if (equipo === undefined || equipo === null || equipo === '') {
            return new DataNotFoundException(codigos.identificadorInvalido);
        }
        const existe = await this.obtenerEquipo(equipo);
        if (existe instanceof DataNotFoundException) {
            return existe;
        }
        if (existe instanceof InternalServerException) {
            return existe;
        }
        const eliminar = await this.refEqp.doc(equipo).delete()
            .then(() => {
                return equipo;
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado, err);
            });
        return eliminar;
    }

    // Endpoint para crear un registro en la coleccion EQP.
    public crearEquipo = async (equipo: EQP, laboratorio: String) => {
        if (equipo === undefined || equipo === null) {
            return new DataNotFoundException(codigos.datosNoEncontrados);
        }

        if (laboratorio === undefined || laboratorio === null || laboratorio === '') {
            return new DataNotFoundException(codigos.informacionNoEnviada);
        }

        const actual = admin.firestore.Timestamp.now().toDate(); // obtener hora y fecha del servidor

        equipo.actualizado = actual;
        equipo.creacion = actual;

        const lab_split = laboratorio.split(' ');        
        const lab = lab_split[0].toLowerCase()+lab_split[1];
        
        let tipo = equipo.tipo.toLowerCase();
        if(tipo.split(' ').length > 1) {
            const tipo_split = tipo.split(' ');
            tipo = tipo_split[0]+'_'+tipo_split[1];
        }

        let dir = `${lab}/${tipo}`;

        if (equipo.checklist === undefined || equipo.checklist === null) {
            equipo.checklist = null;
        }

        const creado = await this.refEqp.add(equipo)
            .then(async data => {
                const key = data.id;
                const eqp = await this.refEqp.doc(key).update({ id: key })
                    .then(() => {
                        return key;
                    })
                    .catch(err => {
                        return new InternalServerException(codigos.datoNoEncontrado, err);
                    });

                dir += `/${key}`;
                
                const qr_data = {
                    id: key,
                    nombre: equipo.nombre,
                    laboratorio
                }

                const qr_generation = await this.generarQr(qr_data, dir)

                if(qr_generation)
                    return eqp;
                else
                    this.refEqp.doc(key).delete()
                    return new InternalServerException(codigos.indefinido);
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado, err);
            });

        if (creado instanceof InternalServerException) {
            return creado;
        }

        const document = await this.obtenerEquipo(creado);
        return {eqp: document, ruta: dir}
    }

    private generarQr = async (qr_data:Object, ruta: String) => {
        const data = JSON.stringify(qr_data);

        // TODO: Mejorar el manejo de errores de la generación de QR y subida al store
        try { 
            // Crea el código QR y lo almacena en una imagen en el servidor
            await QRCode.toFile('./qr.png', data, { color: {dark: "#000",light: "#FFF"} });
            
            // Busca la imagen del QR y la sube a firebase storage
            await this.bucket.upload('./qr.png', {resumable: false, destination: `${ruta}/qr.png`})
            
        } catch(err){
            console.error(err);
            return false;
        }

        return true;
    }

    public subirImagen = async (img: any, ruta: string) => {
        if(img === undefined || img === null) {
            return new InternalServerException(codigos.indefinido);
        }

        const extension = img.mimetype.split('/')[1];

        const file = this.bucket.file(`${ruta}/imagen.${extension}`);
            //console.log(file);
            /*const writer = file.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: img.mimetype
                }
            });
    
            writer.on('error', (error) => {
                console.error(error);
                return new InternalServerException(codigos.indefinido, error)
            });
    
            writer.on('finish', () => {
                return true
            })
    
            writer.end(img.buffer)*/

        const options = {
            resumable: false,
            metadata: {
                contentType: img.mimetype
            }
        }

        file.save(img.buffer, options)
            .then(() => {
                console.log('saved');
                return true;
            })
            .catch((error) => {
                console.log(error)
                return new InternalServerException(codigos.indefinido, error)
            });


        return true
    }
}
