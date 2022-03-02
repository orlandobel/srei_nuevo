import { Request, Response, Router,NextFunction } from "express";
import Controller from '../../interfaces/controller.interface';

import MesasCM from "./Mesas.CM";

import HttpException from "../../exceptions/HttpException";

class MesasController implements Controller {
    public router = Router();
    public path = '/mesas';
    private mesasCM = new MesasCM();

    constructor(basePath: string) {
        this.path = basePath + this.path;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path + '/prestamos/:laboratorio', this.mesasPrestamos);
    }

    private mesasPrestamos = async (req: Request, res: Response, next: NextFunction) => {
        const { laboratorio } = req.params;
        const respuesta = await this.mesasCM.mesasPrestamos(laboratorio);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, mesas: respuesta });
        }
    }
}

export default MesasController;