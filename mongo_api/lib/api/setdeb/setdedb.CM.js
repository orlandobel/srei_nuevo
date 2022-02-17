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
require("colors");
const bcrypt = require("bcrypt");
const EQP_interface_1 = require("../../interfaces/collections/EQP.interface");
const USR_interface_1 = require("../../interfaces/collections/USR.interface");
const LAB_interface_1 = require("../../interfaces/collections/LAB.interface");
const Encrypt = {
    cryptPassword: (password) => bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),
    comparePassword: (password, hashPassword) => bcrypt.compare(password, hashPassword)
        .then(resp => resp)
};
class SetdebCM {
    constructor() {
        this.oldEl1 = 'yOKBPAdFsjM5E0eTE5XJ';
        this.oldEl2 = 'yM4ycYkidpFrJeXDpCvr';
        this.F1 = 'fFnIVA0z3srodI0mT7mx';
        this.F2 = 'xhn0GmzvxKyVPKY0vBl7';
        this.oldP1 = 'f6i9NOItTuV01gdqUgbe';
        this.GP = '3nKoA7mPQXm5nIAB9CmT';
        this.initLabs = () => __awaiter(this, void 0, void 0, function* () {
            const electronicaI = yield LAB_interface_1.default.create({
                nombre: "Electronica I",
                edificio: "Ligeros I"
            });
            const electronicaII = yield LAB_interface_1.default.create({
                nombre: "Electronica II",
                edificio: "Ligeros I"
            });
            const pesadosI = yield LAB_interface_1.default.create({
                nombre: "Pesados I",
                edificio: "Pesados I"
            });
            const pesadosII = yield LAB_interface_1.default.create({
                nombre: "Pesados II",
                edificio: "Pesados II"
            });
            return { electronicaI, electronicaII, pesadosI, pesadosII };
        });
        this.initUsuarios = (el1, el2, p1, p2) => __awaiter(this, void 0, void 0, function* () {
            const passLigerosI = yield Encrypt.cryptPassword("adminElectroncaI");
            const passLigerosII = yield Encrypt.cryptPassword("adminElectroncaII");
            const passPesadosI = yield Encrypt.cryptPassword("adminPesadosI");
            const passPesadosII = yield Encrypt.cryptPassword("adminPesadosII");
            const adminLigerosI = yield USR_interface_1.default.create({
                tipo: 0,
                usuario: 'ElectronicaI',
                clave: passLigerosI,
                nombre: 'Ligeros I',
                laboratorio: el1
            });
            const adminLigerosII = yield USR_interface_1.default.create({
                tipo: 0,
                usuario: 'ElectronicaII',
                clave: passLigerosII,
                nombre: 'Ligeros II',
                laboratorio: el2
            });
            const adminPesadosI = yield USR_interface_1.default.create({
                tipo: 0,
                usuario: 'PesadosI',
                clave: passPesadosI,
                nombre: 'Pesados I',
                laboratorio: p1
            });
            const adminPesadosII = yield USR_interface_1.default.create({
                tipo: 0,
                usuario: 'PesadosII',
                clave: passPesadosII,
                nombre: 'Pesados II',
                laboratorio: p2
            });
            return { adminLigerosI, adminLigerosII, adminPesadosI, adminPesadosII };
        });
        this.actualizarEquipos = (el1, el2, p1, p2) => __awaiter(this, void 0, void 0, function* () {
            yield EQP_interface_1.default.updateMany({ laboratorio: this.oldEl1 }, { $set: { laboratorio: el1 } });
            yield EQP_interface_1.default.updateMany({ laboratorio: this.oldEl2 }, { $set: { laboratorio: el2 } });
            yield EQP_interface_1.default.updateMany({ laboratorio: this.oldP1 }, { $set: { laboratorio: p1 } });
            yield EQP_interface_1.default.updateMany({ laboratorio: this.GP }, { $set: { laboratorio: p1 } });
            yield EQP_interface_1.default.updateMany({ laboratorio: this.F1 }, { $set: { laboratorio: p2 } });
            yield EQP_interface_1.default.updateMany({ laboratorio: this.F2 }, { $set: { laboratorio: p2 } });
        });
        this.removerCampos = () => __awaiter(this, void 0, void 0, function* () {
            yield EQP_interface_1.default.updateMany({}, { $unset: { id: '', propietario: '', qr_path: '', img_path: '' } });
        });
    }
}
exports.default = SetdebCM;
//# sourceMappingURL=setdedb.CM.js.map