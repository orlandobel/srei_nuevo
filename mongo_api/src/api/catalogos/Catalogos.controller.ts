import { Request, Response, Router, NextFunction } from 'express';
import  Controller from '../../interfaces/controller.interface';

import validationMiddleware from '../../middleware/validation.middleware';
import { CrearEquipo, EditarEquipo } from './catalogos.dto';

import CatalogoCM from './Catalogos.CM';

import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

import * as multer from 'multer'
//const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
});

class CatalogosController implements Controller {
    public router = Router();
    public path = '/equipo';

    private catalogosCM = new CatalogoCM();

    constructor(basePath: string) {
        this.path = basePath + this.path;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(this.path + '/:uid', this.obtenerEquipo);
        this.router.get(this.path + '/tipo/:tipo/:lab', this.obtenerEquipoTipo);
        this.router.get(this.path + '/:laboratorio/:tipo/:id/:imagen', this.obtenerImagen);
        this.router.post(this.path + '/crear', validationMiddleware(CrearEquipo, true), this.crearEquipo);
        this.router.post(this.path + '/imagenes', upload.single('imagen'), this.generarImagen);
        this.router.put(this.path + '/editar', validationMiddleware(EditarEquipo, true), this.editarEquipo);
        this.router.delete(this.path + '/eliminar/:laboratorio/:tipo/:id', this.eliminarEquipo);
    }

    private obtenerEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const uid = req.params.uid;
        const respuesta = await this.catalogosCM.obtenerEquipo(uid);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, eqp: respuesta });
        }
    }

    private obtenerEquipoTipo = async (req: Request, res: Response, next: NextFunction) => {
        const { tipo, lab } = req.params;

        const respuesta = await this.catalogosCM.obtenerEquipoTipo(tipo, lab);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, eqps: respuesta });
        }
    }

    private obtenerImagen = async (req: Request, res: Response, next: NextFunction) => {
        const { laboratorio, tipo, id, imagen } = req.params; 
        const ruta = `${laboratorio}/${tipo}/${id}/${imagen}`;
        
        const respuesta = await this.catalogosCM.obtenerImagen(ruta);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send(respuesta);
        }
    }

    private crearEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const { eqp, laboratorio } = req.body;

        const respuesta = await this.catalogosCM.crearEquipo(eqp, laboratorio);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, ...respuesta });
        }
    }

    private generarImagen = async (req: Request, res: Response, next: NextFunction) => {
        const { ruta } = req.body;
        const imagen = req.file;

        const respuesta = await this.catalogosCM.subirImagen(imagen, ruta);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200 });
        }
    }

    private editarEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const { eqp } = req.body;

        const respuesta = await this.catalogosCM.editarEquipo(eqp);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, eqp: respuesta });
        }
    }

    private eliminarEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const { laboratorio, tipo, id } = req.params;
        const ruta = `${laboratorio}/${tipo}/${id}`;

        const respuesta = await this.catalogosCM.eliminarEquipo(id, ruta);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200 });
        }
    }
}

export default CatalogosController;