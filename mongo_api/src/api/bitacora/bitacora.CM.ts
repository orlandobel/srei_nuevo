import { codigos } from '../../exceptions/codigos';

import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import HttpException from 'src/exceptions/HttpException';

import EQP, { Equipo, EquipoPrestamo } from '../../interfaces/collections/EQP.interface';
import { Alumno } from '../../interfaces/collections/USR.interface';
import BadRequestException from '../../exceptions/BadRequestException';
import PRT, { Prestamo } from '../../interfaces/collections/PRT.interface';
import LAB from '../../interfaces/collections/LAB.interface';
import { startOfToday, startOfTomorrow } from 'date-fns';


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

    public crearPrestamo = async(alumnos: Array<Alumno>, equipo: Array<EquipoPrestamo>, laboratorio: string, mesa: any)
        : Promise<any | HttpException | void> => {
        if(alumnos === null || alumnos === undefined || alumnos.length === 0) {
            console.log('Sin alumnos registrados'.red);
            return new BadRequestException('Debe de haber al menos un alumno en el registro');
        }

        if(equipo === null || equipo === undefined || equipo.length === 0)
            return new BadRequestException('Debe de haber al menos un equipo en el registro');

        if(laboratorio === null || laboratorio === undefined || laboratorio === '')
            return new BadRequestException('El laboratorio es requerido');

        try {
            const prestamo: any = {
                alumnos,
                equipo,
                laboratorio,
            }

            const lab = await LAB.findById(laboratorio).exec()
            
            if(lab === null || lab === undefined)
                return new DataNotFoundException(codigos.datoNoEncontrado, "Laboratorio no encontrado")

            if(lab.nombre.includes("Electronica")) {
                console.log(mesa);
                if(mesa === null || mesa === undefined || mesa === '') {
                    return new BadRequestException('Seleccione una mesa para registrar')
                }

                prestamo.mesa = mesa
            }

            equipo.forEach(e => {
                EQP.findByIdAndUpdate(e._id, { $set: { disponible: false } }).exec()
                    .then(() => {
                        console.log(`${e.nombre} ahora ocupado`. yellow);
                    })
            });

            const creado = await PRT.create(prestamo);

            return creado as Prestamo;
        } catch(error) {
            console.error(`Error al generar un prestamo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    public consultarBitacoraDia = async (laboratorio: string): Promise<void | Prestamo[] | HttpException> => {
        if(laboratorio === null || laboratorio === undefined || laboratorio == '') 
            return new BadRequestException("Laboratorio no enviado");
            
        try {
                const start = startOfToday();
                const end = startOfTomorrow();
                
                const creado = {
                    $gte: start,
                    $lt: end
                }

            const prestamos = await PRT.find({ laboratorio, creado }).exec() as Prestamo[];

            if(prestamos === null || prestamos === undefined) 
                return new DataNotFoundException("Erro inesperado al buscar prestamos");

            return prestamos;
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }
}

export default BitacoraCM;