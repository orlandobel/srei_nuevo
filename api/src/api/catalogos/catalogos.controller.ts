/*
 *   Versión 1.1
 *   Creado al 10/09/2020
 *   Creado por: IBelmonte
 *   Modificado al: 23/10/2020
 *   Editado por: GBautista
 *   Copyright SReI
 */

import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';

// middleware
import validationMiddleware from '../../middleware/validation.middleware';
import { CrearEquipo, EditarEquipo } from './catalogos.dto';

// import de archivos CM
import CatalogosCM from './catalogosCM';

// import de exceptions
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
})

// controlador para rutas de equipo
class CatalogosController implements Controller {
    public router = Router();
    public path = '/equipo'; // path principal de acceso a las rutas del controlador

    // imports de classes CM
    private catalogosCM = new CatalogosCM();

    // constructor del controlador
    constructor(pathGeneral: string) {
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }

    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/:uid', this.obtenerEquipo);
        this.router.get(this.path + '/tipo/:tipo/:lab', this.obtenerEquipoTipo)
        this.router.post(this.path + '/crear', validationMiddleware(CrearEquipo, true), this.crearEquipo);
        this.router.post(this.path + '/imagenes', upload.single('imagen'), this.generarImagenes);
        this.router.put(this.path + '/editar', validationMiddleware(EditarEquipo, true), this.editarEquipo);
        this.router.delete(this.path + '/eliminar/:id/:laboratorio', this.eliminarEquipo);
        //this.router.get(this.path + '/foo', this.qr);
    }

    /*
    * @description Endpoint para retornar un registro de la coleccion EQP.
    * @params uid
    * @param  uid(id del usuario tomado de params) 
    * @retuns {status:200, eqp: {...} }	
    * @author Belmont
    */
    private obtenerEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const prueba = req.params.uid;
        const respuesta = await this.catalogosCM.obtenerEquipo(prueba);
        
        //const respuesta = await this.catalogosCM.generarQr('03tzuLLEBBueUOa2I9DI', 'cizalla', 'Electronica I', 'Tarjetas Programables');
        
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
        }

        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
        }

        res.send({ status: 200, eqp: respuesta });
    }

    /*
    * @description Endpoint para retornar una sub coleccion de la coleccion EQP.
    * @params tipo
    * @param  tipo(tipo del equipo tomado de params) 
    * @retuns {status: 200, eqps: {...} }
    * @author GBautista	
    */
   private obtenerEquipoTipo = async (req: Request, res: Response, next: NextFunction) => {
    const {tipo, lab} = req.params;

    const respuesta = await this.catalogosCM.obtenerEquipoTipo(tipo, lab);
    if (respuesta instanceof DataNotFoundException) {
        res.send(respuesta);
    }

    if (respuesta instanceof InternalServerException) {
        res.send(respuesta);
    }

    res.send({ status: 200, eqps: respuesta });
}

    /*
    * @description Endpoint para editar un registro de la coleccion EQP.
    * @params id,tipo,nombre,estado,disponible,propietario,caracteristicas, checklist
    * @param  id(id del registro), tipo(tipo del equipo), nombre(nombre del equipo), estado(indica el estado del equipo),
    * disponible(indica si se encuentra disponible), propietario(dueño del equipo UPIIZ), 
    * caracteristicas(Arreglo en el que se especifican características generales del equipo),
    * checklist(Array solo está presente en la maquinaria)
    * @retuns {status: 200, editado: true, eqp: {...} }	
    * @author Belmont
    */
    private editarEquipo = async (req: Request, res: Response) => {
        const { eqp, laboratorio } = req.body;
        const respuesta = await this.catalogosCM.editarEquipo(eqp, laboratorio);

        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
            return;
        }
        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
            return;
        }
        res.send({ status: 200, editado: true, ...respuesta });
    }

    /*
    * @description Endpoint para eliminar un registro de la coleccion EQP.
    * @params id
    * @param  id(id del registro tomado de params)
    * @retuns {status: 200, eliminado: true, eqp: '...' }
    * @author Belmont
    */
    private eliminarEquipo = async (req: Request, res: Response) => {
        const { id, laboratorio} = req.params;
        console.log(req.params);
        
        console.log(id)
        console.log(laboratorio)
        const respuesta = await this.catalogosCM.eliminarEquipo(id, laboratorio);

        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
        }

        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
        }

        res.send({ status: 200, eliminado: true, eqp: respuesta });
    }

    /*
    * @description Endpoint para crear un registro en la coleccion EQP.
    * @params id,tipo,nombre,estado,disponible,propietario,caracteristicas, checklist
    * @param  id(id del registro), tipo(tipo del equipo), nombre(nombre del equipo), estado(indica el estado del equipo),
    * disponible(indica si se encuentra disponible), propietario(dueño del equipo UPIIZ), 
    * caracteristicas(Arreglo en el que se especifican características generales del equipo),
    * checklist(Array solo está presente en la maquinaria)
    * @retuns {status: 200, creado: true, eqp: {...} }	
    * @author Belmont
    */
    private crearEquipo = async (req: Request, res: Response) => {
        const { eqp, laboratorio } = req.body;
        
        const respuesta = await this.catalogosCM.crearEquipo(eqp, laboratorio);
        console.log(respuesta);
        
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
        }

        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
        }
        
        res.send({ status: 200, creado: true, ...respuesta });
    }

    private generarImagenes = async (req: Request, res: Response) => {
        const { ruta, id } = req.body;
        const imagen = req.file;

        const respuesta = await this.catalogosCM.subirImagen(imagen, ruta, id);

        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
        }

        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
        }

        res.send({status: 200, estatus: respuesta})

    }

}

export default CatalogosController;