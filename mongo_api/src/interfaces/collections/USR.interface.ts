import { Schema, model } from 'mongoose';

export interface Usuario {
    _id?: any;
    tipo: number;
    usuario?: string;
    clave?: string;
    nombre: string;
    vetado?: Array<any>;
    laboratorio?: string;
}

export interface Trabajador extends Omit<Usuario, 'vetado' | 'boleta'> {
    _id: any;
    usuario: string;
    clave: string;
    laboratorio: string;
}

export interface Alumno extends Omit<Usuario, '_id' | 'clave' | 'laboratorio' > {
    programa: string
}

const USRSchema = new Schema<Usuario>({
    tipo: { type: Number, required: true },
    usuario: { type: String, required: false },
    clave: { type: String, required: false },
    nombre: { type: String, required: true },
    vetado: { type: Array, required: false },
    laboratorio: { type: String, required: false },
},
{
    timestamps: {
        createdAt: 'creacion',
        updatedAt: 'actualizado'
    },
    collection: 'USR'
});

const USR = model<Usuario>('USR', USRSchema);

export default USR;