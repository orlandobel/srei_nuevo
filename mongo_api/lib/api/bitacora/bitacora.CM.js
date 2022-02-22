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
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
const EQP_interface_1 = require("../../interfaces/collections/EQP.interface");
class BitacoraCM {
    constructor() {
        this.verDisponibilidadEQP = (equipo) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === null || equipo === undefined || equipo === '')
                return new DataNotFoundException_1.default(codigos_1.codigos.informacionNoEnviada);
            try {
                const registro = yield EQP_interface_1.default.findById(equipo).exec();
                if (registro === null || registro === undefined)
                    return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
                const eqp = registro;
                return eqp.disponible;
            }
            catch (error) {
                return new InternalServerException_1.default(codigos_1.codigos.indefinido, error);
            }
        });
    }
}
exports.default = BitacoraCM;
//# sourceMappingURL=bitacora.CM.js.map