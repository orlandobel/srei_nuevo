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
const validation_middleware_1 = require("../../middleware/validation.middleware");
const catalogos_dto_1 = require("./catalogos.dto");
const Catalogos_CM_1 = require("./Catalogos.CM");
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
});
class CatalogosController {
    constructor(basePath) {
        this.router = (0, express_1.Router)();
        this.path = '/equipo';
        this.catalogosCM = new Catalogos_CM_1.default();
        this.obtenerEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const uid = req.params.uid;
            const respuesta = yield this.catalogosCM.obtenerEquipo(uid);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send({ status: 200, eqp: respuesta });
            }
        });
        this.obtenerEquipoTipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { tipo, lab } = req.params;
            const respuesta = yield this.catalogosCM.obtenerEquipoTipo(tipo, lab);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send({ status: 200, eqps: respuesta });
            }
        });
        this.obtenerImagen = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { laboratorio, tipo, id, imagen } = req.params;
            const ruta = `${laboratorio}/${tipo}/${id}/${imagen}`;
            const respuesta = yield this.catalogosCM.obtenerImagen(ruta);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.sendFile(respuesta);
            }
        });
        this.crearEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { eqp, laboratorio } = req.body;
            const respuesta = yield this.catalogosCM.crearEquipo(eqp, laboratorio);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send(Object.assign({ status: 200 }, respuesta));
            }
        });
        this.generarImagen = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { ruta } = req.body;
            const imagen = req.file;
            const respuesta = yield this.catalogosCM.subirImagen(imagen, ruta);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send({ status: 200 });
            }
        });
        this.editarEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { eqp } = req.body;
            const respuesta = yield this.catalogosCM.editarEquipo(eqp);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send({ status: 200, eqp: respuesta });
            }
        });
        this.eliminarEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { laboratorio, tipo, id } = req.params;
            const ruta = `${laboratorio}/${tipo}/${id}`;
            const respuesta = yield this.catalogosCM.eliminarEquipo(id, ruta);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send({ status: 200 });
            }
        });
        this.path = basePath + this.path;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + '/:uid', this.obtenerEquipo);
        this.router.get(this.path + '/tipo/:tipo/:lab', this.obtenerEquipoTipo);
        this.router.get(this.path + '/:laboratorio/:tipo/:id/:imagen', this.obtenerImagen);
        this.router.post(this.path + '/crear', (0, validation_middleware_1.default)(catalogos_dto_1.CrearEquipo, true), this.crearEquipo);
        this.router.post(this.path + '/imagenes', upload.single('imagen'), this.generarImagen);
        this.router.put(this.path + '/editar', (0, validation_middleware_1.default)(catalogos_dto_1.EditarEquipo, true), this.editarEquipo);
        this.router.delete(this.path + '/eliminar/:laboratorio/:tipo/:id', this.eliminarEquipo);
    }
}
exports.default = CatalogosController;
//# sourceMappingURL=Catalogos.controller.js.map