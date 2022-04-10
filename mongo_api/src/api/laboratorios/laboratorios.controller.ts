import { Request, Response, Router, NextFunction } from 'express';
import  Controller from '../../interfaces/controller.interface';


import LaboratoriosCM from './laboratorios.CM';

import HttpException from '../../exceptions/HttpException';


class LaboratoriosController implements Controller {
    public router = Router();
    public path = '/laboratorios';

    private laboratoriosCM = new LaboratoriosCM();

    constructor(basePath: string) {
        this.path = basePath + this.path;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(this.path + '/simple', this.obtenerLABsimple);
    }

    private obtenerLABsimple = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const respuesta = await this.laboratoriosCM.obtenerLABsimple();

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, labs: respuesta });
        }
    }
}

export default LaboratoriosController;