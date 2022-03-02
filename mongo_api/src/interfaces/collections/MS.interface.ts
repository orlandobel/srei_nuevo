import { Schema, model } from 'mongoose';

export interface Mesa {
    _id?: any;
    nombre: string;
    alumnos?: Array<any>;
    equipo?: Array<Schema.Types.ObjectId>;
    laboratorio: string;
}

const MSSchema = new Schema<Mesa>({
    nombre: { type: String, required: true },
    alumnos: { type: [], required: false },
    equipo: [{ type: Schema.Types.ObjectId, ref: 'EQP', required: false }],
    laboratorio: { type: String, required: true }
},
{
    timestamps: {
        createdAt: 'creado',
        updatedAt: 'actualizado'
    },
    collection: 'MS'
});

const MS = model<Mesa>('MS', MSSchema);

export default MS;