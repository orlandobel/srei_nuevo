import { Schema, model } from 'mongoose';

export interface Usuario {
    id?: any;
    tipo: number;
    usuario?: string;
    clave?: string;
    nombre: string;
    vetado?: Array<any>;
    laboratorio?: string;
}

export interface Trabajador extends Omit<Usuario, 'vetado'> {
    id: any;
    usuario: string;
    clave: string;
    laboratorio: string;
}

const schema = new Schema<Usuario>({
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

const USR = model<Usuario>('USR', schema);

export default USR;