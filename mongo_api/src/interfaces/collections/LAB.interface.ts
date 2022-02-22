import { Schema, model } from 'mongoose';

export interface Laboratorio {
    _id?: any;
    edificio: string,
    nombre: string,
}

const schema = new Schema<Laboratorio>({
    edificio: { type: String, required: true },
    nombre: { type: String, required: true },
},
{
    timestamps: {
        createdAt: 'creacion',
        updatedAt: 'actualizado',
    },
    collection: 'LAB'
});

const LAB = model<Laboratorio>('LAB', schema);
export default LAB;