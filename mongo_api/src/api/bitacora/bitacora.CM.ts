import { codigos } from '../../exceptions/codigos';

import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import HttpException from 'src/exceptions/HttpException';

import EQP, { Equipo, EquipoPrestamo } from '../../interfaces/collections/EQP.interface';
import { Alumno } from '../../interfaces/collections/USR.interface';
import BadRequestException from '../../exceptions/BadRequestException';
import PRT, { Prestamo } from '../../interfaces/collections/PRT.interface';
import LAB from '../../interfaces/collections/LAB.interface';
import MS, { Mesa } from '../../interfaces/collections/MS.interface';
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

    public crearPrestamo = async(alumnos: Array<Alumno>, equipo: Array<EquipoPrestamo>, laboratorio: string, mesa_nombre: string)
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

            const lab = await LAB.findById(laboratorio).exec();
            let mesa;
            
            if(lab === null || lab === undefined)
            return new DataNotFoundException(codigos.datoNoEncontrado, "Laboratorio no encontrado")
            
            if(lab.nombre.includes("Electronica")) {
                console.log(mesa_nombre);
                if(mesa_nombre === null || mesa_nombre === undefined || mesa_nombre === '') {
                    return new BadRequestException('Seleccione una mesa para registrar')
                }
                
                mesa = await MS.findOneAndUpdate({ laboratorio, nombre: mesa_nombre }, { $set: { alumnos } }, { new: true }) as Mesa;
                prestamo.mesa = mesa_nombre
            }

            const creado = await PRT.create(prestamo) as Prestamo;
            equipo.forEach(e => {
                EQP.findByIdAndUpdate(e._id, { $set: { disponible: false } }).exec()
                    .then(() => {
                        console.log(`${e.nombre} ahora ocupado`. yellow);
                    })
            });

            return { prestamo: creado, mesa};
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

    public entregarPrestamo = async (id: string): Promise<void | HttpException | Prestamo> => {
        if(id === null || id === undefined || id === '')
            return new BadRequestException("Id del prestmo no envíado");

        try {
            const prestamo = await PRT.findByIdAndUpdate(id, { $set: { activo: false } }, { new: true }).exec() as Prestamo;

            if(prestamo === null || prestamo === undefined)
                return new DataNotFoundException(codigos.datoNoEncontrado, "Prestamo no encotnrado en la base de datos");

            const laboratorio = prestamo.laboratorio;
            const nombre_mesa = prestamo.mesa;

            MS.findOneAndUpdate({ laboratorio, nombre: nombre_mesa }, { $set: { alumnos: [] } }).exec();
            
            prestamo.equipo.forEach(e => {
                EQP.findByIdAndUpdate(e._id, { $set: { disponible: true } }).exec()
                    .then(eqp => {
                        console.log(`${eqp?.nombre} ahora disponible`.yellow)
                    });
            });

            return prestamo;
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }

    public bitacoraList = async( fechaInicial: string, fechaFinal: string) =>{
        try {
            const registro = await PRT.find({ creado: { $gte: new Date(fechaInicial), $lte: new Date(fechaFinal) } } ).exec();

            if(registro === null || registro === undefined) 
                return new DataNotFoundException(codigos.identificadorInvalido);
            
            return registro;
        } catch(error) {
            console.log(`Error al obtener equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }
}

export default BitacoraCM;