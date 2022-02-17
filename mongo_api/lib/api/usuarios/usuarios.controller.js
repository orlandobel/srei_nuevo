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
const express_1 = require("express");
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
const BadRequestException_1 = require("../../exceptions/BadRequestException");
const usuarios_CM_1 = require("./usuarios.CM");
class UsuariosController {
    constructor(basePath) {
        this.router = (0, express_1.Router)();
        this.path = '/usuarios';
        this.usuariosCM = new usuarios_CM_1.default();
        this.ingresar = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { usuario, clave } = req.body;
            const respuesta = yield this.usuariosCM.ingresar(usuario, clave);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send(Object.assign({ status: 200 }, respuesta));
            }
        });
        this.checkLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers['authorization'];
            const respuesta = yield this.usuariosCM.checkToken(token);
            if (respuesta instanceof BadRequestException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send(Object.assign({ status: 200 }, respuesta));
            }
        });
        this.crearEmpleado = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { usuario, clave } = req.body;
            const respuesta = yield this.usuariosCM.crearEmpleado(usuario, clave);
            if (respuesta instanceof BadRequestException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send({ status: 200, usuario: respuesta });
            }
        });
        this.path = basePath + this.path;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/login', this.ingresar);
        this.router.post(this.path + '/login/test', this.ingresar);
        this.router.post(this.path + '/login/verify', this.checkLogin);
        this.router.post(this.path + '/crear/empleado', this.crearEmpleado);
    }
}
exports.default = UsuariosController;
//# sourceMappingURL=usuarios.controller.js.map