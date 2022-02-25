import { codigos  } from "../../exceptions/codigos";

import MS, { Mesa } from "../../interfaces/collections/MS.interface";

import InternalServerException from "../../exceptions/InternalServerException";
import DataNotFoundException from "../../exceptions/DataNotFoundException";
import BadRequestException from "../../exceptions/BadRequestException";
import HttpException from "../../exceptions/HttpException";

class MesasCM {
    public mesasPrestamos = async (laboratorio: string): Promise<Mesa[] | HttpException | void> => {
        if(laboratorio === null || laboratorio === undefined || laboratorio === '') {
            return new BadRequestException("El id de laboratorio es requerido");
        }

        try {
            const mesas = await MS.find({ laboratorio }, 'nombre | laboratorio').exec();

            if(mesas === null || mesas === undefined) {
                return new DataNotFoundException(codigos.datosNoEncontrados, "No se enconraron mesas en el laboratorio");
            }

            return mesas as Mesa[];
        } catch(error) {
            return new InternalServerException(error)
        }
    }
}

export default MesasCM;