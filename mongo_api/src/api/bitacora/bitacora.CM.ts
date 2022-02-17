import { codigos } from '../../exceptions/codigos';

import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

import EQP, { Equipo } from '../../interfaces/collections/EQP.interface';
import HttpException from 'src/exceptions/HttpException';

class BitacoraCM {
    public verDisponibilidadEQP = async (equipo: string): Promise<boolean | HttpException | void> => {
        if(equipo === null || equipo === undefined || equipo === '')
            return new DataNotFoundException(codigos.informacionNoEnviada);

        try {
            const registro = await EQP.findById(equipo).exec();

            if(registro === null || registro === undefined)
                return new DataNotFoundException(codigos.datoNoEncontrado)

            const eqp = registro as Equipo;
            return eqp.disponible;
        } catch(error) {
            return new InternalServerException(codigos.indefinido, error);
        }
    }
}

export default BitacoraCM;