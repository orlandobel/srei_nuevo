import { Request , Response, Router, NextFunction } from 'express';
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import BadRequestException from '../../exceptions/BadRequestException';

import Controller from '../../interfaces/controller.interface';
import UsuariosCM from './usuarios.CM';
import HttpException from '../../exceptions/HttpException';

class UsuariosController implements Controller {
    public router = Router();
    public path = '/usuarios';

    private usuariosCM = new UsuariosCM();

    constructor(basePath: string) {
        this.path = basePath + this.path;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path + '/alumnos/listar', this.listarAlumnos);
        this.router.post(this.path + '/login', this.ingresar);
        this.router.post(this.path + '/login/test', this.ingresar);
        this.router.post(this.path + '/login/verify', this.checkLogin);
        this.router.post(this.path + '/crear/empleado', this.crearEmpleado);
        this.router.post(this.path + '/consulta/dae', this.consultaDae);
        this.router.post(this.path + '/vetado/consulta', this.verificarVetado);
        this.router.put(this.path + '/vetado/actualizar', this.actualizarVetado);
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

    public consultaDae = async (req: Request, res: Response, next: NextFunction) => {
        const { url } = req.body;
        const respuesta = await this.usuariosCM.consultaDae(url);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status:200, alumno: respuesta });
        }
    }

    public listarAlumnos = async (req: Request, res: Response, next: NextFunction) => {
        const respuesta = await this.usuariosCM.listarAlumnos();

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, alumnos: respuesta });
        }
    }   

    public verificarVetado = async (req: Request, res: Response, next: NextFunction) =>  {
        const { alumno, laboratorio } = req.body;

        const respuesta = await this.usuariosCM.checkVetado(alumno, laboratorio);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, ...respuesta });
        }
    } 

    public actualizarVetado = async (req: Request, res: Response, next: NextFunction) => {
        const { alumno, laboratorio, vetado } = req.body;

        const respuesta = await this.usuariosCM.actualizarVetado(alumno, laboratorio, vetado);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, alumno: respuesta });
        }
    }
}

export default UsuariosController;