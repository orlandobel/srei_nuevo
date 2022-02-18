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
const setdedb_CM_1 = require("./setdedb.CM");
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
class SetdebController {
    constructor(basePath) {
        this.router = (0, express_1.Router)();
        this.path = '/setdeb';
        this.setdebCM = new setdedb_CM_1.default();
        this.initialgizeDB = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const laboratorios = yield this.setdebCM.initLabs();
            const el1 = laboratorios.electronicaI._id;
            const el2 = laboratorios.electronicaII._id;
            const p1 = laboratorios.pesadosI._id;
            const p2 = laboratorios.pesadosII._id;
            yield this.setdebCM.initUsuarios(el1, el2, p1, p2);
            yield this.setdebCM.actualizarEquipos(el1, el2, p1, p2);
            res.send({ msg: "Base de datos actuaglizada correctamente" });
        });
        this.removerCampos = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.setdebCM.removerCampos();
            res.send();
        });
        this.setQR = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield this.setdebCM.generateQRs();
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send(Object.assign({ status: 200 }, respuesta));
            }
        });
        this.path = basePath + this.path;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.initialgizeDB);
        this.router.get(this.path + '/remover', this.removerCampos);
        this.router.get(this.path + '/qrG', this.setQR);
    }
}
exports.default = SetdebController;
//# sourceMappingURL=setdeb.controller.js.map