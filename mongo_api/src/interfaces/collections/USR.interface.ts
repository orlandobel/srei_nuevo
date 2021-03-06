import { Schema, model } from 'mongoose';

export interface Usuario {
    _id?: any;
    tipo: number;
    usuario: string;
    clave?: string;
    nombre: string;
    vetado?: any;
    laboratorio?: string;
    enEspera?: boolean;
    programa?: string;
    correo?: string;
    resetToken?: string;
}

export interface Trabajador extends Omit<Usuario, 'vetado' | 'boleta'> {
    _id: any;
    usuario: string;
    clave: string;
    laboratorio: string;
    enEspera: boolean;
    correo: string;
}

export interface Alumno extends Omit<Usuario, 'clave' | 'laboratorio' | 'enEspera' | 'correo' | 'resetToken' > {
    programa: string
}

const USRSchema = new Schema<Usuario>({
    tipo: { type: Number, required: true },
    usuario: { type: String, required: false },
    clave: { type: String, required: false },
    nombre: { type: String, required: true },
    vetado: { type: {}, required: false },
    laboratorio: { type: String, required: false },
    enEspera: { type: Boolean, required: false },
    correo: { type: String, required: false },
    programa: { type: String, requires: false },
    resetToken: { type: String, requires: false },
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