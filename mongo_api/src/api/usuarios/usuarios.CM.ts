import { codigos } from "../../exceptions/codigos";
import axios from 'axios';
import 'colors';
import * as bcrypt from 'bcrypt';
const jsdom = require('jsdom');
import config from '../../config/server';
import transporter from '../../config/mailer';

import DataNotFoundException from "../../exceptions/DataNotFoundException";
import InternalServerException from "../../exceptions/InternalServerException";
import BadRequestException from "../../exceptions/BadRequestException";

import USR, { Usuario, Trabajador, Alumno } from '../../interfaces/collections/USR.interface';
import LAB, { Laboratorio } from '../../interfaces/collections/LAB.interface';
import HttpException from '../../exceptions/HttpException';
import DataNotSaveException from "../../exceptions/DataNotSaveException";

const jwt = require('jsonwebtoken');
const TOKEN = 'c8b0e9c6b16c2499435ce026d5188674a567bb75e00a271ff6010d8c975c2723cdc81fcc5dc69f79afa85c22f8cdf3bbf488952f2ba18c1cda89f097e0c3597c';

const Encrypt = {
    cryptPassword: (password: string) =>
        bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),  
    comparePassword: (password: string, hashPassword: string) =>
        bcrypt.compare(password, hashPassword)
        .then(resp =>  resp)

}

class UsuariosCM {
    public ingresar = async (usuario: string, clave: string): Promise<Object | HttpException> => {
        if(usuario === null || usuario === undefined || usuario === '') {
            console.log(`Usuario no envíado`.red)
            return new BadRequestException("RFC no envíado");
        }

        if(clave === null || clave === undefined || clave === '') {
            console.log('Clave no envíada'.red);
            return new BadRequestException("Clave no envíada")
        }

        try {
            const consulta = await USR.find({ usuario, $not: { tipo: 0} }) as Trabajador[];
            console.log(consulta);
            const usr = await this.findAsync(consulta, async e =>  await Encrypt.comparePassword(clave, e.clave));
            
            if(usr === null || usr === undefined) {
                console.log('Usuario no encontrado'.red);
                return new DataNotFoundException(codigos.noEncontradoUsuario ,"El usuario o la contraseña no son correctos");
            }
            
            if(usr.enEspera) {
                console.log("El usuario aun no esta aprovado");
                return new BadRequestException("Su usuario aun no ha sido aprovado por un adminestrador");
            }

            const usr_string = JSON.stringify(usr);
            const usr_obj = JSON.parse(usr_string);


            const lab_ref = await LAB.findById(usr.laboratorio);
            const lab = lab_ref as Laboratorio;

            const tkn = jwt.sign(usr_obj, TOKEN, { expiresIn: "4h"});

            return { token: tkn, usuario: usr, laboratorio: lab };
        } catch(error) {
            console.log(`Error al buscar el usuario: ${error}`.red);
            return new InternalServerException(error);
        }
    }

    public checkToken = async (tkn: any): Promise<Object | HttpException> => {
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
            return new InternalServerException(error);
        }
    }

    public crearEmpleado = async(usr: Usuario, clave: string): Promise<Usuario | HttpException> => {
        if(usr === null || usr === undefined) 
            return new BadRequestException("Por favor llene todos los campos requeridos");

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
            usr.enEspera = true;

            const creado = await USR.create(usr);

            if(creado === null || creado === undefined)
                return new DataNotSaveException('No se pudo crear el usuario, intentelo de nuevo más tarde');

            return creado as Usuario;
        } catch(error) {
            console.log(`Error al crear el ususario: ${error}`.red);
            return new InternalServerException(error);
        }
    }
    
    public consultaDae = async(url: string): Promise<Object | HttpException> => {
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

    public listarAlumnos = async (): Promise<Alumno[] | HttpException> => {
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

    public listarEmpleados = async (): Promise<Trabajador[] | HttpException> => {
        try {
            const empleados = await USR.find({ tipo: { $ne:0} }).exec() as Trabajador[];

            if(empleados === null || empleados === undefined)
                return [];

            return empleados;
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }

    public checkVetado = async (alumno: Alumno, laboratorio: string): Promise<Object | HttpException> => {
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

    public toggleEmpleado = async (id_empleado: string, tipo: number): Promise<Trabajador | HttpException>=>{
        if(id_empleado === null || id_empleado === undefined || id_empleado === '') {
            console.log('Empleado no enviado'. red);
            return new BadRequestException("Empleado no enviado");
        }
        if(tipo === null || tipo === undefined) {
            console.log('Permisos administrativos no enviado'. red);
            return new BadRequestException("Permisos administrativos no enviado");
        }
        try {
            const empleado = await USR.findByIdAndUpdate(id_empleado, { $set: { tipo } }, { new: true }).exec();
            return empleado as Trabajador
        } catch (error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }

    }

    public aceptarTrabajador = async (id_empleado: string): Promise<Trabajador | HttpException>=>{
        if(id_empleado === null || id_empleado === undefined || id_empleado === '') {
            console.log('Empleado no enviado'. red);
            return new BadRequestException("Empleado no enviado");
        }
        
        try {
            const enEspera = false
            const empleado = await USR.findByIdAndUpdate(id_empleado, { $set: { enEspera } }, { new: true }).exec();
            return empleado as Trabajador
        } catch (error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }

    } 

    public actualizarVetado = async (id_alumno: string, laboratorio: string, veto: boolean): Promise<Alumno | HttpException> => {
        if(id_alumno === null || id_alumno === undefined || id_alumno === '') {
            console.log('Alumno no enviado'.red);
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

    public actualizarClave = async (id: string, clave_old: string, clave1: string, clave2: string): Promise<HttpException | void> => {
        if(id === null || id === undefined || id === '') {
            console.log('No se envió el usuario en el cambio de contraseña'.red);
            return new BadRequestException("Falta el usuario");
        }

        if(clave_old === null || clave_old === undefined || clave_old === '') {
            console.log('Falta la antigua contraseña'.red);
            return new BadRequestException("Escriva su contraseña actual");
        }

        if(clave1 === null || clave1 === undefined || clave1 === '') {
            console.log('Falta la nueva contraseña'.red);
            return new BadRequestException("Escriva su nueva contraseña");
        }

        if(clave2 === null || clave2 === undefined || clave2 === '') {
            console.log('Falta repetir la nueva contraseña'.red);
            return new BadRequestException("Repita su nueva contraseña");
        }

        try {
            const u = await USR.findById({usuario: id}).exec() as Trabajador;
            const comp_clave = await Encrypt.comparePassword(clave_old, u.clave);

            if(!comp_clave) {
                console.log("Contraseña incorrecta".red);
                return new DataNotFoundException(codigos.datoNoEncontrado, "La contraseña no es correcta");
            }

            if(clave1 != clave2) {
                console.log('Las contraseñas no coinciden'.red);
                return new BadRequestException("Las contraseñas no coinciden");
            }

            if(clave_old === clave1){
                console.log('La nueva contraseña no puede ser igual a ala anterior'.red);
                return new BadRequestException("La nuva contraseña no puede ser igual a la anterior");
            }

            const clave = await Encrypt.cryptPassword(clave1);
            await USR.findByIdAndUpdate(id, { $set: { clave } }, { new: true } ) as Trabajador;

            //return usuario;
        } catch(error) {
            console.log(`${error}`.red);
            return new InternalServerException(error);
        }
    }

    public claveOlvidada = async(usuario: string): Promise<string | HttpException> => {
        if(usuario === null || usuario === undefined || usuario === '') {
            console.log('Usuario no envíado al recuperar contraseña'.red);
            return new BadRequestException("El campo usuario no puede estar vacío");
        }

        const errMsg = "Parece que algo salio mal, intentelo de nuevo más tarde";

        try {
            let trabajador = await USR.findOne({ usuario }).exec() as Trabajador;

            if(trabajador === null || trabajador === undefined) {
                return new DataNotFoundException(codigos.datoNoEncontrado, "Parece que su RFC es erroneo o no está registrado");
            }

            console.log(trabajador);
            const token =  jwt.sign({ trabajadorId: trabajador._id, usuario }, TOKEN, { expiresIn: '1H' });
            trabajador = await USR.findByIdAndUpdate(trabajador._id, { $set: { resetToken: token } }, { new: true } ).exec() as Trabajador;
            const validationlink = `localhost:8080/recuperar-clave/${token}`;
            
            // TODO: Enviar correo de recuperacion
            await transporter.sendMail({
                from: '"Recuperación de contraseña SReI" <srei.upiiz@gmail.com>',
                to: trabajador.correo,
                subject: 'Recuperación de contraseña',
                //text: validationlink,
                html: `
                    <b>Recuperar la contraseña</b>
                    <a href='${validationlink}'>${validationlink}</a>
                `
            });

            return "Verifica tu correo eléctronicao, si no encuentras el correo en la bandeja de entrada verifica en la carpeta SPAM";
        } catch(error) {
            console.log(`Error al envíar correo de recuperacion de contraseña: ${error}`.red);
            return new InternalServerException(errMsg);
        }

    }

    public recuperarClave = async (clave: string, resetToken: string): Promise<HttpException | void> => {
        if(clave === null || clave === undefined || clave === '') {
            console.log('La clave no puede estar vácia en recuperar contraseña'.red);
            return new BadRequestException("La clave no puede estar vácia");
        }

        if(resetToken === null || resetToken === undefined || resetToken === '') {
            console.log('El token de recuperacion no se envío'.red);
            return new BadRequestException('Algo salio mal en la consulta, intentelo de nuevo más tarde');
        }

        try {
            const verifyToken = await jwt.verify(resetToken, TOKEN, (error: Error, usr: Usuario) => {
                if(error) return null;
                if(usr) return usr;
            });

            if(verifyToken === null || verifyToken === undefined) {
                console.log("Token de recuperacion invalido o inexistente".red);
                return new BadRequestException("Link de recuperación caducado")
            }

            const usuario = await USR.findOne({ resetToken }).exec() as Trabajador;

            if(usuario === null || usuario === undefined) {
                console.log("No se encontro el usuario".red);
                return new DataNotFoundException("Ocurrio un error inesperado al actualizar la contraseña, intentelo de nuevo más tarde");
            }

            usuario.clave = await Encrypt.cryptPassword(clave);
            delete usuario.resetToken;

            await USR.findByIdAndUpdate(usuario._id, usuario).exec();

            //TODO: loguear al usuario y retornar el token cuando se cambie la contraseña
        } catch(error) {
            console.log(`Error al recuperar la contraseña: ${error}`.red);
            return new InternalServerException(error);
        }
    }

    public eliminarTrabajador = async (_id:string): Promise<HttpException | void> =>{
        if(_id === null || _id === undefined)
            return new DataNotFoundException(codigos.informacionNoEnviada);

        try {
            const eliminado = await USR.deleteOne({_id})

            if(eliminado === null || eliminado === undefined)
                return new InternalServerException(codigos.indefinido);

            if(eliminado.deletedCount < 1)
                return new DataNotFoundException(codigos.datoNoEncontrado)

        } catch(error) {
            console.log(`Error al eliminar equipo: ${error}`.red);
            return new InternalServerException(codigos.indefinido, error);
        }
    }

    private findAsync = async <T>(arr: T[], callback: (t: T) => Promise<boolean>): Promise<T | undefined> => {
        for(const t of arr) {
            if(await callback(t))
                return t;
        }
        return undefined;
    }

}

export default UsuariosCM;