import { Request , Response, Router, NextFunction } from 'express';
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import BadRequestException from '../../exceptions/BadRequestException';

import Controller from '../../interfaces/controller.interface';
import UsuariosCM from './usuarios.CM';

class UsuariosController implements Controller {
    public router = Router();
    public path = '/usuarios';

    private usuariosCM = new UsuariosCM();

    constructor(basePath: string) {
        this.path = basePath + this.path;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(this.path + '/login', this.ingresar);
        this.router.post(this.path + '/login/test', this.ingresar);
        this.router.post(this.path + '/login/verify', this.checkLogin);
        this.router.post(this.path + '/crear/empleado', this.crearEmpleado);
    }

    private ingresar = async (req: Request, res: Response, next: NextFunction) => {
        const { usuario, clave } = req.body;
        const respuesta = await this.usuariosCM.ingresar(usuario, clave);

        if(respuesta instanceof DataNotFoundException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({status: 200, ...respuesta})
        }
    }

    private checkLogin = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization'];

        const respuesta = await this.usuariosCM.checkToken(token);

        if(respuesta instanceof BadRequestException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, ...respuesta });
        }
    }

    private crearEmpleado = async (req: Request, res: Response, next: NextFunction) => {
        const { usuario, clave } = req.body;

        const respuesta = await this.usuariosCM.crearEmpleado(usuario, clave);

        if(respuesta instanceof BadRequestException || respuesta instanceof InternalServerException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, usuario: respuesta });
        }
    }
}

export default UsuariosController;