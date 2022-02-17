"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const codigos_1 = require("../../exceptions/codigos");
//import axios from 'axios';
require("colors");
const bcrypt = require("bcrypt");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const BadRequestException_1 = require("../../exceptions/BadRequestException");
const USR_interface_1 = require("../../interfaces/collections/USR.interface");
const LAB_interface_1 = require("../../interfaces/collections/LAB.interface");
const jwt = require('jsonwebtoken');
const TOKEN = 'c8b0e9c6b16c2499435ce026d5188674a567bb75e00a271ff6010d8c975c2723cdc81fcc5dc69f79afa85c22f8cdf3bbf488952f2ba18c1cda89f097e0c3597c';
const Encrypt = {
    cryptPassword: (password) => bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),
    comparePassword: (password, hashPassword) => bcrypt.compare(password, hashPassword)
        .then(resp => resp)
};
class UsuariosCM {
    constructor() {
        this.ingresar = (usuario, clave) => __awaiter(this, void 0, void 0, function* () {
            if (usuario === null || usuario === undefined || usuario === '') {
                console.log(`Usuario no envíado`.red);
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            }
            if (clave === null || clave === undefined || clave === '') {
                console.log('Clave no envíada'.red);
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            }
            try {
                const consulta = yield USR_interface_1.default.find({ usuario });
                const filtro = consulta.find((e) => __awaiter(this, void 0, void 0, function* () { return Encrypt.comparePassword(clave, e.clave); }));
                if (filtro === null || filtro === undefined) {
                    console.log('Usuario no encontrado'.red);
                    return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
                }
                const usr = filtro;
                const usr_string = JSON.stringify(usr);
                const usr_obj = JSON.parse(usr_string);
                const lab_ref = yield LAB_interface_1.default.findById(usr.laboratorio);
                const lab = lab_ref;
                const tkn = jwt.sign(usr_obj, TOKEN, { expiresIn: "4h" });
                return { token: tkn, usuario: usr, laboratorio: lab };
            }
            catch (error) {
                console.log(`Error al buscar el usuario: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido);
            }
        });
        this.checkToken = (tkn) => __awaiter(this, void 0, void 0, function* () {
            if (tkn === null || tkn === undefined || tkn === '')
                return new BadRequestException_1.default('Token de usuario no envíado');
            try {
                const res = jwt.verify(tkn, TOKEN, (error, usr) => {
                    if (error)
                        console.log(`${error}`.red);
                    if (usr)
                        console.log("logged".green);
                    return usr;
                });
                if (res === null || res === undefined)
                    return { login: false };
                const lab = yield LAB_interface_1.default.findById(res.laboratorio);
                return { login: true, usuario: res, laboratorio: lab };
            }
            catch (error) {
                console.log(`Error al comprobar el token: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
        this.crearEmpleado = (usr, clave) => __awaiter(this, void 0, void 0, function* () {
            if (usr === null || usr === undefined)
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            if (clave === null || clave === undefined || clave === '')
                return new BadRequestException_1.default('Las 2 claves son necesarias');
            if (usr.clave === null || usr.clave === undefined || usr.clave === '')
                return new BadRequestException_1.default('Las 2 claves son necesarias');
            try {
                clave = yield Encrypt.cryptPassword(clave);
                const comparacion = yield Encrypt.comparePassword(usr.clave, clave);
                if (!comparacion)
                    return new BadRequestException_1.default('Las claves no coinciden');
                usr.clave = clave;
                const creado = yield USR_interface_1.default.create(usr);
                if (creado === null || creado === undefined)
                    return new InternalServerException_1.default(codigos_1.codigos.indefinido, 'No se pudo crear el usuario, intentelo de nuevo más tarde');
                return creado;
            }
            catch (error) {
                console.log(`Error al crear el ususario: ${error}`.red);
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
    }
}
exports.default = UsuariosCM;
//# sourceMappingURL=usuarios.CM.js.map