import { Request , Response, Router, NextFunction } from 'express';

import Controller from '../../interfaces/controller.interface';
import UsuariosCM from './usuarios.CM';
import HttpException from '../../exceptions/HttpException';
import { Usuario } from '../../interfaces/collections/USR.interface';

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
        this.router.get(this.path + '/empleados/listar', this.listarEmpleados);
        this.router.post(this.path + '/login', this.ingresar);
        this.router.post(this.path + '/login/verify', this.checkLogin);
        this.router.post(this.path + '/crear/empleado', this.crearEmpleado);
        this.router.post(this.path + '/consulta/dae', this.consultaDae);
        this.router.post(this.path + '/vetado/consulta', this.verificarVetado);
        this.router.put(this.path + '/vetado/actualizar', this.actualizarVetado);
        this.router.put(this.path + '/empleados/actualizar', this.actualizarPermisosTrabajador);
        this.router.put(this.path + '/empleados/enEspera', this.actualizarEsperaTrabajador);
        this.router.delete(this.path + '/empleados/eliminar/:id', this.eliminarEmpleado);
        this.router.put(this.path + '/clave/actualizar', this.actualizarClave);
    }

    private ingresar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { usuario, clave } = req.body;
        const respuesta = await this.usuariosCM.ingresar(usuario, clave);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({status: 200, ...respuesta})
        }
    }

    private checkLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.headers['authorization'];

        const respuesta = await this.usuariosCM.checkToken(token);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, ...respuesta });
        }
    }

    private crearEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { nombre, usuario, clave, laboratorio, passwordCheck} = req.body;

        const usr = {
            nombre,
            usuario,
            clave,
            laboratorio,
            tipo:1,
            vetado: [],
            enEspera: true
        }as Usuario

        const respuesta = await this.usuariosCM.crearEmpleado(usr, passwordCheck);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, usuario: respuesta });
        }
    }

    public consultaDae = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { url } = req.body;
        const respuesta = await this.usuariosCM.consultaDae(url);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status:200, alumno: respuesta });
        }
    }

    public listarAlumnos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const respuesta = await this.usuariosCM.listarAlumnos();

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, alumnos: respuesta });
        }
    }  
    
    public listarEmpleados = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const respuesta = await this.usuariosCM.listarEmpleados();

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, empleados: respuesta });
        }
    }  

    public verificarVetado = async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
        const { alumno, laboratorio } = req.body;

        const respuesta = await this.usuariosCM.checkVetado(alumno, laboratorio);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta)
        } else {
            res.send({ status: 200, ...respuesta });
        }
    } 
    
    private actualizarPermisosTrabajador = async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
        let {empleado, tipo} = req.body;
        tipo = (tipo % 2) + 1;
        const respuesta = await this.usuariosCM.toggleEmpleado(empleado, tipo);
        
        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, empleado: respuesta });
        }
    }

    private actualizarEsperaTrabajador = async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
        let {empleado} = req.body;
        const respuesta = await this.usuariosCM.aceptarTrabajador(empleado);
        
        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, empleado: respuesta });
        }
    }

    public actualizarVetado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { alumno, laboratorio, vetado } = req.body;

        const respuesta = await this.usuariosCM.actualizarVetado(alumno, laboratorio, vetado);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200, alumno: respuesta });
        }
    }

    private eliminarEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> =>  {
        const {id} = req.params;
        const respuesta = await this.usuariosCM.eliminarTrabajador(id);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200 });
        }
    }

    public actualizarClave = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id, clave_old, clave1, clave2 } =  req.body;

        const respuesta = await this.usuariosCM.actualizarClave(id, clave_old, clave1, clave2);

        if(respuesta instanceof HttpException) {
            res.status(respuesta.status).send(respuesta);
        } else {
            res.send({ status: 200 });
        }
    }
}

export default UsuariosController;