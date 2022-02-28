import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";

import validationMiddleware from "../../middleware/validation.middleware";
import { CrearPrestamo } from './bitacora.dto';

import BitacoraCM from "./bitacora.CM";

import HttpException from "../../exceptions/HttpException";

class BitacoraController implements Controller {
    public router = Router();
    public path = '/prestamo';

    private bitacoraCM = new BitacoraCM();


    constructor(basePath: string) {
        this.path = basePath + this.path;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path + '/:uid', this.disponibilidadEquipo);
        this.router.post(this.path + '/generar', validationMiddleware(CrearPrestamo, true),this.crearPrestamo);
    }

    private disponibilidadEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const { uid } = req.params;
        const respuesta = await this.bitacoraCM.verDisponibilidadEQP(uid);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, disponible: respuesta });
        }
    }

    private crearPrestamo = async (req: Request, res: Response, next: NextFunction) => {
        const { alumnos, equipo, laboratorio, mesa } = req.body;
        const respuesta = await this.bitacoraCM.crearPrestamo(alumnos, equipo, laboratorio, mesa);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, prestamo: respuesta });
        }
    }
}

export default BitacoraController;