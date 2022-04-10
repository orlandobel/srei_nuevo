import { codigos } from '../../exceptions/codigos';

import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

import LAB, { Laboratorio } from '../../interfaces/collections/LAB.interface';
import HttpException from '../../exceptions/HttpException';



class LaboratoriosCM {

    /*
     * Obtencion de un equipo en especifico
     * @param equipo: _id del equipo que se ésta buscando
     * @returns DataNotFoundException si "equipo" no fue proporcionado o si no se encontró el registro en la base de datos
     * @returns InternalServerException si ocurre algún error inesérado en la ejecución de la consulta
     * @returns Equipo si el registro fue encontrado en la base de datos
    */
    public obtenerLABsimple = async (): Promise<Laboratorio[] | HttpException> => {
        try {
            const registro = await LAB.find({},'_id, nombre').exec();

            if(registro === null || registro === undefined) 
                return new DataNotFoundException(codigos.identificadorInvalido);

            return registro as Laboratorio[];

        } catch(error) {
            console.log(`Error al obtener equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

}

export default LaboratoriosCM;