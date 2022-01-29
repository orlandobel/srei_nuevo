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
    public editarEquipo = async (equipo: EQP, laboratorio: String) => {
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

        const dir = this.generarRuta(laboratorio, equipo.tipo, key);
        
        equipo.qr_path = existe.img_path;

        if(existe.img_path != null && existe.img_path != undefined)
            equipo.img_path = existe.img_path;
            
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

        return {eqp: editado, ruta: dir};
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

        let dir = '';

        const creado = await this.refEqp.add(equipo)
            .then(async data => {
                const key = data.id;
                let eqp = await this.refEqp.doc(key).update({ id: key })
                    .then(() => key)
                    .catch(err => new InternalServerException(codigos.datoNoEncontrado, err));

                if(!(eqp instanceof InternalServerException)) {
                    dir = this.generarRuta(laboratorio, equipo.tipo, key);
                    
                    const qr_data = {
                        id: key,
                        nombre: equipo.nombre,
                        laboratorio
                    }

                    const qr_generation = await this.generarQr(qr_data, dir)

                    if(qr_generation instanceof InternalServerException){
                        await this.refEqp.doc(key).delete()
                        return qr_generation
                    }
                    
                    eqp = await this.refEqp.doc(key).update({qr_path: qr_generation})
                        .then(() => key)
                        .catch(async error => {
                            await this.refEqp.doc(key).delete();
                            return new InternalServerException(codigos.indefinido, error)
                        });
                    
                }
                return eqp;
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
        let publicURL = '';

        try { 
            // Crea el código QR y lo almacena en una imagen en el servidor
            await QRCode.toFile('./qr.png', data, { color: {dark: "#000",light: "#FFF"} });

            const options = {
                resumable: false, 
                destination: `${ruta}/qr.png`,
                
            };
            
            // Busca la imagen del QR y la sube a firebase storage
            const generated = await this.bucket.upload('./qr.png', options);
            const qr = generated[0]
            await qr.makePublic()

            publicURL = qr.metadata.mediaLink
            
        } catch(err){
            console.error(err);
            return new InternalServerException(codigos.indefinido, err);
        }

        return publicURL;
    }

    private generarRuta = (laboratorio: String, tipo: String, id: String) => {
        const lab_split = laboratorio.split(' ');        
        const lab = lab_split[0].toLowerCase()+lab_split[1];
        
        tipo = tipo.toLowerCase();
        if(tipo.split(' ').length > 1) {
            const tipo_split = tipo.split(' ');
            tipo = tipo_split[0]+'_'+tipo_split[1];
        }

        return `${lab}/${tipo}/${id}`;
    }

    public subirImagen = async (img: any, ruta: string, id: string) => {
        // Verificación de datos nulos
        if(img === undefined || img === null) {
            return new InternalServerException(codigos.indefinido);
        }

        if(ruta === undefined || ruta === null || ruta === '') 
            return new InternalServerException(codigos.indefinido);
        
        if(id === undefined || id === null || id === '')
            return new DataNotFoundException(codigos.identificadorInvalido);

        // Obtención del equipo para agregar la ruta de la imagen al registro
        const equipo = await this.obtenerEquipo(id);
        if(equipo instanceof DataNotFoundException || equipo instanceof InternalServerException)
            return equipo;

        // Obtención o creación del archivo en firebase storage
        const extension = img.mimetype.split('/')[1]
        const file = this.bucket.file(`${ruta}/imagen.${extension}`);
        
        // Objeto de opciones de la escritura del archivo
        const options = {
            resumable: false,
            metadata: {
                contentType: img.mimetype,
            },
        }
        
        try {
            // Guardando la imágen en firebase storage
            await file.save(img.buffer, options);
            await file.makePublic();

            // Obtención de la ruta pública de la imágen
            const publicUrl = file.metadata.mediaLink;

            // Añadiendo la ruta de la imágen al registro en base de datos del equipo
            equipo.img_path = publicUrl;
            const actualizado = await this.refEqp.doc(id).update(equipo)
                .then(() => console.log('Imgen agregada al equipo'))
                .catch(error => {
                    console.error(error);
                    return new InternalServerException(codigos.indefinido, error);
                });

            if(actualizado instanceof InternalServerException)
                return actualizado;
        } catch(error) {
            console.log('\x1b[31m%s\x1b[0m', 'erro al actualizar');
            console.log(error);
            return new InternalServerException(codigos.indefinido, error);
        }

        return true
    }
}
