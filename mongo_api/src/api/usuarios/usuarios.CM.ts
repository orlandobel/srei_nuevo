import { codigos } from "../../exceptions/codigos";
import axios from 'axios';
import 'colors';
import * as bcrypt from 'bcrypt';
const jsdom = require('jsdom');

import DataNotFoundException from "../../exceptions/DataNotFoundException";
import InternalServerException from "../../exceptions/InternalServerException";
import BadRequestException from "../../exceptions/BadRequestException";

import USR, { Usuario, Trabajador, Alumno } from '../../interfaces/collections/USR.interface';
import LAB, { Laboratorio } from '../../interfaces/collections/LAB.interface';
import HttpException from "src/exceptions/HttpException";

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
    
    public consultaDae = async(url: string): Promise<any> => {
        if(url === null || url === undefined || url === '')
            return new BadRequestException("Url de consulta no envíada");

        try {
            const data: string = await axios.get(url).then(res => res.data);
            const dom = new jsdom.JSDOM(data);
            const document = dom.window.document;
            
            const nombre = document.getElementsByClassName('nombre')[0].textContent;
            const boleta: string = document.getElementsByClassName('boleta')[0].textContent;
            const usuario = boleta.substring(0,10)
            //const imagen = document.getElementsByClassName('pic')[1].querySelector('img').src;
            const programa = document.getElementsByClassName('carrera')[0].textContent;


            return { nombre, usuario, programa,/* imagen */};
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }

    public listarAlumnos = async (): Promise<void | HttpException | Alumno[]> => {
        try {
            const alumnos = await USR.find({ tipo: 0 }).exec() as Alumno[];

            if(alumnos === null || alumnos === undefined)
                return [];

            return alumnos;
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }

    public checkVetado = async (alumno: Alumno, laboratorio: string): Promise<void | HttpException | Object> => {
        if(alumno === null || alumno === undefined) {
            console.log('Alumno no envíado'.red);
            return new BadRequestException('Alumno no envíado');
        }

        if(laboratorio === null || laboratorio === undefined || laboratorio === '') {
            console.log('Laboratorio no envíado');
            return new BadRequestException('Id del laboratorio no envíadp');
        }

        try {
            let alm = await USR.findOne({ usuario: alumno.usuario }).exec();

            if(alm === null || alm === undefined) {
                alumno.tipo = 0;
                alm = await USR.create(alumno);
                console.log(alm);
                return { alumno: alm, vetado: false };
            }

            if(alm.vetado === null || alm.vetado === undefined)
                return { alumno: alm, vetado: false };
            
            console.log(true);
            const vetado = alm.vetado[laboratorio] || false;
            
            return { alumno: alm, vetado }
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }

    public actualizarVetado = async (id_alumno: string, laboratorio: string, veto: boolean): Promise<void | HttpException | Alumno> => {
        if(id_alumno === null || id_alumno === undefined || id_alumno === '') {
            console.log('Alumno no enviado'. red);
            return new BadRequestException("Alumno no enviado");
        }

        if(laboratorio === null || laboratorio === undefined || laboratorio === '') {
            console.log('Laboratorio no enviado'. red);
            return new BadRequestException("Laboratorio no enviado");
        }

        if(veto === null || veto === undefined) {
            console.log('Estado de veto no enviado'. red);
            return new BadRequestException("Estado de veto no enviado");
        }

        try {
            const registro = await USR.findById(id_alumno, 'vetado').exec();
            let vetado = registro?.vetado;

            if(vetado === null || vetado === undefined) {
                vetado = {};
            }

            vetado[laboratorio] = veto;

            const alumno = await USR.findByIdAndUpdate(id_alumno, { $set: { vetado } }, { new: true }).exec();

            return alumno as Alumno;
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }

}

export default UsuariosCM;