import 'colors';
import * as bcrypt from 'bcrypt';

import EQP, { Equipo } from '../../interfaces/collections/EQP.interface';
import USR, { Usuario } from '../../interfaces/collections/USR.interface';
import LAB, { Laboratorio } from '../../interfaces/collections/LAB.interface';
import fs = require('fs');

import InternalServerException from '../../exceptions/InternalServerException';
import { codigos } from '../../exceptions/codigos';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

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

    public actualizarEquipos = async (el1: string, el2: string, p1: string, p2: string): Promise<any> => {
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
            const registro = await EQP.find({},'_id nombre laboratorio').exec();

            if(registro === null || registro === undefined) 
                return new DataNotFoundException(codigos.identificadorInvalido);

            const arrRegistros = registro as Equipo[];
            
            arrRegistros.forEach(arr =>{
                this.generarQr(arr, arr.laboratorio , arr._id);
                
    
            });
            
            return arrRegistros
        } catch(error) {
            console.log(`Error al obtener equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
/*
        const arrObj = [
            {
                'id': '1234',
                'nombre': 'wop1',
                'laboratorio' : 'el'

            },
            {
                'id': '1234',
                'nombre': 'wop2',
                'laboratorio' : 'el'

            },
            {
                'id': '1234',
                'nombre': 'wop3',
                'laboratorio' : 'el'

            },
        ];
*/
    }
    /* Generación del código QR para el equpo */
    private generarQr = async (qr_data: Object, carpeta: string, pngName: string): Promise<any> => {
        const data = JSON.stringify(qr_data);

        try { 
            // Directorio destinado a guardar los archivos relacionados con el equipo
            const ruta = `./storage/QRs/${carpeta}`
            
            // Si el directorio anterior no existe lo crea de manera recursiva
            if(!fs.existsSync(ruta)) 
                fs.mkdirSync(ruta, { recursive: true });
            
            // Crea el código QR y lo almacena en una imagen en el directorio desiggando
            await QRCode.toFile(`${ruta}/${pngName}.png`, data, { color: {dark: "#000",light: "#FFF"} });
            console.log(ruta)
        } catch(err){
            console.error(err);
            return new InternalServerException(codigos.indefinido, err);
        }
    }
}

export default SetdebCM