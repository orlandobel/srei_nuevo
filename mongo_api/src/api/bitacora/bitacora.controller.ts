import { Request, Response, NextFunction, Router } from "express";
import Controller from "../../interfaces/controller.interface";

import BitacoraCM from "./bitacora.CM";

import InternalServerException from "../../exceptions/InternalServerException";
import DataNotFoundException from "../../exceptions/DataNotFoundException";

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
    }

    private disponibilidadEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const { uid } = req.params;
        const respuesta = await this.bitacoraCM.verDisponibilidadEQP(uid);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, disponible: respuesta });
        }
    }
}

export default BitacoraController;