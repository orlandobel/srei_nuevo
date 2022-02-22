"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const caracteristicasSchema = new mongoose_1.Schema({
    fabricante: { type: String, required: true },
    modelo: { type: String, required: true },
    serie: { type: String, required: true },
    descripcion: { type: String, required: false },
});
const checkSchema = new mongoose_1.Schema({
    nombre: { type: String, required: true },
    acronimo: { type: String, required: true },
    estatus: { type: Boolean, required: true },
}, { timestamps: { createdAt: 'creado', updatedAt: 'actualizado' } });
const EQPSchema = new mongoose_1.Schema({
    id: { type: String, required: false },
    tipo: { type: String, required: true },
    nombre: { type: String, required: true },
    estado: { type: Number, required: true },
    disponible: { type: Boolean, required: true },
    propietario: { type: String, required: false },
    laboratorio: { type: String, required: true },
    caracteristicas: { type: caracteristicasSchema, required: false },
    path: { type: String, required: false },
    checklist: { type: [checkSchema], required: false },
}, {
    timestamps: {
        createdAt: 'creado',
        updatedAt: 'actualizado'
    },
    collection: 'EQP',
});
const EQP = (0, mongoose_1.model)('EQP', EQPSchema);
exports.default = EQP;
//# sourceMappingURL=EQP.interface.js.map