import { Schema, model } from 'mongoose';
import { EquipoPrestamo, caracteristicasSchema } from './EQP.interface';
import { Alumno } from './USR.interface';

const USRSchema = new Schema<Alumno>({
    usuario: {type: String, required: true },
    nombre: { type: String, required: true, },
    programa: { type: String, required: true },
    vetado: { type: [], required: false }
});

const EquipoPrestamoSchema = new Schema<EquipoPrestamo>({
    nombre: { type: String, required: true },
    caracteristicas: { type: caracteristicasSchema, required: true },
});

export interface Prestamo {
    _id?: any;
    alumnos: Array<Alumno>;
    equipo: Array<EquipoPrestamo>;
    laboratorio: string;
    mesa?: string;
    activo: boolean;
}

const PRTSchema = new Schema<Prestamo>({
    alumnos: { type: [USRSchema], required: true },
    equipo: { type: [EquipoPrestamoSchema], required: true },
    laboratorio: { type: String, required: true },
    mesa: { type: String, required: false },
    activo: { type: Boolean, required: true, default: true },
},
{
    timestamps: {
        createdAt: 'creado',
        updatedAt: 'actualizado'
    },
    collection: 'PRT'
})

const PRT = model<Prestamo>('PRT', PRTSchema)

export default PRT;
