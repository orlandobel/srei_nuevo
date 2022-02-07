/*
 *   Versión 1.0
 *   Creado al 04/02/2022
 *   Creado por: GBautista
 *   Copyright SReI
 */
import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';

// middleware
//import validationMiddleware from '../../middleware/validation.middleware';
//import { CrearEquipo, EditarEquipo } from './catalogos.dto';

// import de archivos CM
import BitacoraCM from './bitacoraCM';

// import de exceptions
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

// controlador para rutas de equipo
class BitacoraController implements Controller {
    public router = Router();
    public path = '/prestamo'; // path principal de acceso a las rutas del controlador

    // imports de classes CM
    private bitacoraCM = new BitacoraCM();

    // constructor del controlador
    constructor(pathGeneral: string) {
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }

    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/:uid', this.disponibilidadEquipo);
    }

    /*
    * @description Endpoint para ver disponibilidad de herramienta 
    * @params uid
    * @param  uid(id de la herramienta tomado de params) 
    * @retuns {status:200, disponible: boolean }	
    * @author GBautista
    */
    private disponibilidadEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const equipo = req.params.uid;
        const respuesta = await this.bitacoraCM.verDisponibilidadEQP(equipo);
        
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
        }

        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
        }

        res.send({ status: 200, disponible: respuesta });
    }

}

export default BitacoraController;

