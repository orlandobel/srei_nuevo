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
const bitacora_CM_1 = require("./bitacora.CM");
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
class BitacoraController {
    constructor(basePath) {
        this.router = (0, express_1.Router)();
        this.path = '/prestamo';
        this.bitacoraCM = new bitacora_CM_1.default();
        this.disponibilidadEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.params;
            const respuesta = yield this.bitacoraCM.verDisponibilidadEQP(uid);
            if (respuesta instanceof DataNotFoundException_1.default || respuesta instanceof InternalServerException_1.default) {
                res.status(respuesta.status).send(respuesta);
            }
            else {
                res.send({ status: 200, disponible: respuesta });
            }
        });
        this.path = basePath + this.path;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + '/:uid', this.disponibilidadEquipo);
    }
}
exports.default = BitacoraController;
//# sourceMappingURL=bitacora.controller.js.map