import { codigos } from "../../exceptions/codigos";
//import axios from 'axios';
import 'colors';
import * as bcrypt from 'bcrypt';

import DataNotFoundException from "../../exceptions/DataNotFoundException";
import InternalServerException from "../../exceptions/InternalServerException";
import BadRequestException from "../../exceptions/BadRequestException";

import USR, { Usuario, Trabajador } from '../../interfaces/collections/USR.interface';
import LAB, { Laboratorio } from '../../interfaces/collections/LAB.interface';

const jwt = require('jsonwebtoken');
const TOKEN = 'c8b0e9c6b16c2499435ce026d5188674a567bb75e00a271ff6010d8c975c2723cdc81fcc5dc69f79afa85c22f8cdf3bbf488952f2ba18c1cda89f097e0c3597c';

const Encrypt = {
    cryptPassword: (password: string) =>
        bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),  
    comparePassword: (password: string, hashPassword: string) =>
        bcrypt.compare(password, hashPassword)
        .then(resp => resp)

}

class UsuariosCM {
    public ingresar = async (usuario: string, clave: string): Promise<any> => {
        if(usuario === null || usuario === undefined || usuario === '') {
            console.log(`Usuario no envíado`.red)
            return new DataNotFoundException(codigos.informacionNoEnviada);
        }

        if(clave === null || clave === undefined || clave === '') {
            console.log('Clave no envíada'.red);
            return new DataNotFoundException(codigos.informacionNoEnviada)
        }

        try {
            const consulta = await USR.find({ usuario }) as Trabajador[];
            console.log(consulta);
            const filtro = consulta.find(async e => Encrypt.comparePassword(clave, e.clave));
            
            if(filtro === null || filtro === undefined) {
                console.log('Usuario no encontrado'.red);
                return new DataNotFoundException(codigos.datoNoEncontrado);
            }
            
            const usr = filtro;
            const usr_string = JSON.stringify(usr);
            const usr_obj = JSON.parse(usr_string);


            const lab_ref = await LAB.findById(usr.laboratorio);
            const lab = lab_ref as Laboratorio;

            const tkn = jwt.sign(usr_obj, TOKEN, { expiresIn: "4h"});

            return { token: tkn, usuario: usr, laboratorio: lab };
        } catch(error) {
            console.log(`Error al buscar el usuario: ${error}`.red);
            return new InternalServerException(codigos.indefinido);
        }
    }

    public checkToken = async (tkn: any): Promise<any> => {
        if(tkn === null || tkn === undefined || tkn === '' )
            return new BadRequestException('Token de usuario no envíado');

        try {
            const res = jwt.verify(tkn, TOKEN, (error: any, usr: any) => {
                if(error) console.log(`${error}`.red);
                if(usr) console.log("logged".green);

                return usr;
            });

            if( res === null || res === undefined)
                return { login: false }

            const lab = await LAB.findById(res.laboratorio);
            return { login: true, usuario: res as Trabajador, laboratorio: lab as Laboratorio };
        } catch(error) {
            console.log(`Error al comprobar el token: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    public crearEmpleado = async(usr: Usuario, clave: string): Promise<any> => {
        if(usr === null || usr === undefined) 
            return new DataNotFoundException(codigos.informacionNoEnviada);

        if(clave === null || clave === undefined || clave === '')
            return new BadRequestException('Las 2 claves son necesarias');

        if(usr.clave === null || usr.clave === undefined || usr.clave === '') 
            return new BadRequestException('Las 2 claves son necesarias');

        try {
            clave = await Encrypt.cryptPassword(clave);
            const comparacion = await Encrypt.comparePassword(usr.clave, clave);

            if(!comparacion)
                return new BadRequestException('Las claves no coinciden');

            usr.clave = clave;

            const creado = await USR.create(usr);

            if(creado === null || creado === undefined)
                return new InternalServerException(codigos.indefinido, 'No se pudo crear el usuario, intentelo de nuevo más tarde');

            return creado as Usuario;
        } catch(error) {
            console.log(`Error al crear el ususario: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }
    
}

export default UsuariosCM;