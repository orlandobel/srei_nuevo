"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    tipo: { type: Number, required: true },
    usuario: { type: String, required: false },
    clave: { type: String, required: false },
    nombre: { type: String, required: true },
    vetado: { type: Array, required: false },
    laboratorio: { type: String, required: false },
}, {
    timestamps: {
        createdAt: 'creacion',
        updatedAt: 'actualizado'
    },
    collection: 'USR'
});
const USR = (0, mongoose_1.model)('USR', schema);
exports.default = USR;
//# sourceMappingURL=USR.interface.js.map