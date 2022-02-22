import { Schema, model } from 'mongoose';

// Interfaz y esquema para embeber objeto tipo caracteristicas
interface caracteristicas { 
    fabricante: string;
    modelo: string;
    serie: string;
    descripcion?: string;
}

const caracteristicasSchema = new Schema<caracteristicas>({
    fabricante: { type: String, required: true },
    modelo: { type: String, required: true },
    serie: { type: String, required: true },
    descripcion: { type: String, required: false },
});


// Interfaz y esquema para el checklist del equipo
interface check {
    nombre: string;
    acronimo: string;
    estatus: boolean;
}

const checkSchema = new Schema<check>({
    nombre: { type: String, required: true },
    acronimo: { type: String, required: true },
    estatus: { type: Boolean, required: true },
}, { timestamps: { createdAt: 'creado', updatedAt: 'actualizado'} });

// Interfáz y esquema para guardar el equipo en mongo
export interface Equipo {
    _id?: any;
    id?: string;
    tipo: string;
    nombre: string;
    estado: number;
    disponible: boolean;
    propietario?: string;
    laboratorio: string;
    caracteristicas: caracteristicas;
    path?: string;
    qr?: string;
    img?: string;
    checklist?: check[];
}

const EQPSchema = new Schema<Equipo>({
    id: { type: String, required: false },
    tipo: { type: String, required: true },
    nombre: { type: String, required: true },
    estado: { type: Number, required: true },
    disponible: { type: Boolean, required: true },
    propietario: { type: String, required: false },
    laboratorio: { type: String, required: true },
    caracteristicas: { type: caracteristicasSchema, required: false },
    path: { type: String, required: false},
    checklist: { type: [checkSchema], required: false },
}, 
{ 
    timestamps: { 
        createdAt: 'creado',
        updatedAt: 'actualizado'
    },
    collection: 'EQP',
});

const EQP = model<Equipo>('EQP', EQPSchema);

export default EQP;