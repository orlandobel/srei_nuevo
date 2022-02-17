import { Request , Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';

import SetdebCM from './setdedb.CM';

class SetdebController implements Controller {
    public router = Router();
    public path = '/setdeb';

    private setdebCM = new SetdebCM();

    constructor(basePath: string) {
        this.path = basePath + this.path;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.initialgizeDB);
        this.router.get(this.path + '/remover',  this.removerCampos);
    }

    public initialgizeDB = async (req: Request, res: Response, next: NextFunction) => {
        const laboratorios = await this.setdebCM.initLabs();

        const el1 = laboratorios.electronicaI._id;
        const el2 = laboratorios.electronicaII._id;
        const p1 = laboratorios.pesadosI._id;
        const p2 = laboratorios.pesadosII._id;

        await this.setdebCM.initUsuarios(el1, el2, p1, p2);
        await this.setdebCM.actualizarEquipos(el1, el2, p1, p2);

        res.send({msg: "Base de datos actuaglizada correctamente"});
    }

    public removerCampos =async (req: Request, res: Response, next: NextFunction) => {
        await this.setdebCM.removerCampos();
        res.send();
    }
}

export default SetdebController;