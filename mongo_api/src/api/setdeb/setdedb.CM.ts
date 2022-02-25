import 'colors';
import * as bcrypt from 'bcrypt';

import EQP, { Equipo } from '../../interfaces/collections/EQP.interface';
import USR, { Usuario } from '../../interfaces/collections/USR.interface';
import LAB, { Laboratorio } from '../../interfaces/collections/LAB.interface';
import fs = require('fs');

import InternalServerException from '../../exceptions/InternalServerException';
import { codigos } from '../../exceptions/codigos';
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import MS from '../../interfaces/collections/MS.interface';

const QRCode = require('qrcode');
const Encrypt = {
    cryptPassword: (password: string) =>
        bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),  
    comparePassword: (password: string, hashPassword: string) =>
        bcrypt.compare(password, hashPassword)
        .then(resp => resp)

}

class SetdebCM {

    private oldEl1 = 'yOKBPAdFsjM5E0eTE5XJ';
    private oldEl2 = 'yM4ycYkidpFrJeXDpCvr';
    private F1 = 'fFnIVA0z3srodI0mT7mx';
    private F2 = 'xhn0GmzvxKyVPKY0vBl7';
    private oldP1 = 'f6i9NOItTuV01gdqUgbe';
    private GP = '3nKoA7mPQXm5nIAB9CmT';

    public initLabs = async (): Promise<any> => {
        const electronicaI = await LAB.create({
            nombre: "Electronica I",
            edificio: "Ligeros I"
        }) as Laboratorio;

        const electronicaII = await LAB.create({
            nombre: "Electronica II",
            edificio: "Ligeros I"
        }) as Laboratorio;

        const pesadosI = await LAB.create({
            nombre: "Pesados I",
            edificio: "Pesados I"
        }) as Laboratorio;

        const pesadosII = await LAB.create({
            nombre: "Pesados II",
            edificio: "Pesados II"
        }) as Laboratorio;

        return { electronicaI, electronicaII, pesadosI, pesadosII }
    }

    public initUsuarios = async (el1: string, el2: string, p1: string, p2: string): Promise<any> => {
        const passLigerosI = await Encrypt.cryptPassword("adminElectroncaI");
        const passLigerosII = await Encrypt.cryptPassword("adminElectroncaII");
        const passPesadosI = await Encrypt.cryptPassword("adminPesadosI");
        const passPesadosII = await Encrypt.cryptPassword("adminPesadosII");

        const adminLigerosI = await USR.create({
            tipo: 0,
            usuario: 'ElectronicaI',
            clave: passLigerosI,
            nombre: 'Ligeros I',
            laboratorio: el1
        }) as Usuario;

        const adminLigerosII = await USR.create({
            tipo: 0,
            usuario: 'ElectronicaII',
            clave: passLigerosII,
            nombre: 'Ligeros II',
            laboratorio: el2
        }) as Usuario;

        const adminPesadosI = await USR.create({
            tipo: 0,
            usuario: 'PesadosI',
            clave: passPesadosI,
            nombre: 'Pesados I',
            laboratorio: p1
        }) as Usuario;

        const adminPesadosII = await USR.create({
            tipo: 0,
            usuario: 'PesadosII',
            clave: passPesadosII,
            nombre: 'Pesados II',
            laboratorio: p2
        }) as Usuario;

        return { adminLigerosI, adminLigerosII, adminPesadosI, adminPesadosII }
    }

    public actualizarEquipos = async (el1: string, el2: string, p1: string, p2: string): Promise<void> => {
        await EQP.updateMany({ laboratorio: this.oldEl1 }, { $set: { laboratorio: el1 } });
        await EQP.updateMany({ laboratorio: this.oldEl2 }, { $set: { laboratorio: el2 } });
        await EQP.updateMany({ laboratorio: this.oldP1 }, { $set: { laboratorio: p1 } });
        await EQP.updateMany({ laboratorio: this.GP }, { $set: { laboratorio: p1 } });
        await EQP.updateMany({ laboratorio: this.F1 }, { $set: { laboratorio: p2 } });
        await EQP.updateMany({ laboratorio: this.F2 }, { $set: { laboratorio: p2 } });        
    }

    public removerCampos = async () =>{
        await EQP.updateMany({}, { $unset: { id: '', propietario: '', qr_path: '', img_path: '' } });
    }

    public generateQRs = async () => {
        //cambiar al obtener todos los miembros de la colecion equipos y crear filtro de objeto
        try {
            //llamada de todos los documentos con filtro de campos
            const registro = await EQP.find({}).exec(); 
            //validadcion de vacios
            if(registro === null || registro === undefined) 
                return new DataNotFoundException(codigos.identificadorInvalido);
            //añadimos formato si no esta vacio
            const arrRegistros = registro as Equipo[];
            //recoremos nuestos valores para generar qr
            arrRegistros.forEach(async arr =>{
                //encontramos el nombre del laboratorio
                const labres = await LAB.findById(arr.laboratorio, 'nombre').exec() 
                //añadimos formato
                const labpick = labres as Laboratorio;
                //corregimos formato para usarlo en forma de path
                const lab_split = labpick.nombre.split(' ');        
                const lab = lab_split[0].toLowerCase()+lab_split[1];
                //información del qr
                const qrImage = {
                    '_id' : arr._id,
                    'nombre' : arr.nombre,
                    'fabricante': arr.caracteristicas.fabricante,
                    'modelo': arr.caracteristicas.modelo,
                    'serie': arr.caracteristicas.serie,
                    'laboratorio' : lab
                }
                //correcion del formato tipo para usarlo en forma de path
                const tipo = arr.tipo.toLowerCase().replace(" ", "_");
                //generación de qr 1 por 1
                this.generarQr(qrImage, lab, tipo, arr._id);
            });
            //retornamos los valores utilizados para ver respuesta clara de que se ejecuto...
            return arrRegistros
        } catch(error) {
            console.log(`Error al obtener equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }
    /* Generación del código QR para el equpo */
    private generarQr = async (qr_data: Object, cpLab: string, cpTipo: string, cpID: string): Promise<any> => {
        const data = JSON.stringify(qr_data);

        try { 
            // Directorio destinado a guardar los archivos relacionados con el equipo
            const ruta = `./storage/${cpLab}/${cpTipo}/${cpID}`
            
            // Si el directorio anterior no existe lo crea de manera recursiva
            if(!fs.existsSync(ruta)) 
                fs.mkdirSync(ruta, { recursive: true });
            
            // Crea el código QR y lo almacena en una imagen en el directorio desiggando
            await QRCode.toFile(`${ruta}/qr.png`, data, { color: {dark: "#000",light: "#FFF"} });
            console.log(ruta)
        } catch(err){
            console.error(err);
            return new InternalServerException(codigos.indefinido, err);
        }
    }

    public agregarPATH = async (): Promise<any> => {
        try {
            //encontramos todos los valores de la coleccion EQP
            const registro = await EQP.find().exec();
            
            //validadcion vacios
            if(registro === null || registro === undefined) 
                return new DataNotFoundException(codigos.identificadorInvalido);
            
            //formato de squema
            const arrRegistros = registro as Equipo[];

            //recorrido para actualizar path
            arrRegistros.forEach(async (arr) => {
                //defino valores dentro del path, como se hizo para generar los qrs
                const labres = await LAB.findById(arr.laboratorio, 'nombre').exec();
                const labpick = labres as Laboratorio;
                const lab_split = labpick.nombre.split(' ');
                const lab = lab_split[0].toLowerCase() + lab_split[1];
                const tipo = arr.tipo.toLowerCase().replace(" ", "_");

                //obtenemos id del equipo en cuestion
                const _id = arr._id;

                //formamos la ruta path
                arr.path = `${lab}/${tipo}/${arr._id}`;

                //actualizamos campo
                await EQP.findOneAndUpdate({ _id }, { $set: arr }, { new: true });
            });
            
            //mensaje de todo correcto indicando que se realizaron los cambios pertinentes
            return {'msg': 'todo correcto'}
        } catch(error) {
            console.log(`Error al obtener equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    public initMesas = async (): Promise<any> => {
        try {
            const labs = await LAB.find({
                $or: [
                    { "nombre": "Electronica I" },
                    { "nombre": "Electronica II"}
                ]
                }).exec() as Laboratorio[];

            if(labs === null || labs === undefined || labs.length === 0)
                return new DataNotFoundException(codigos.datoNoEncontrado, "Laboratorios no encontrados");

            const mesa = {
                nombre: '',
                laboratorio: ''
            };

            for(const lab of labs) {
                mesa.laboratorio = lab._id;

                for(let i=1; i<17; i++){
                    mesa.nombre = `Mesa ${i}`;
                    await MS.create(mesa);
                }
            }
        } catch(error) {
            return new InternalServerException(error);
        }
    }
}

export default SetdebCM