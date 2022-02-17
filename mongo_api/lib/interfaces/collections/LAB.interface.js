"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    edificio: { type: String, required: true },
    nombre: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'creacion',
        updatedAt: 'actualizado',
    },
    collection: 'LAB'
});
const LAB = (0, mongoose_1.model)('LAB', schema);
exports.default = LAB;
//# sourceMappingURL=LAB.interface.js.map