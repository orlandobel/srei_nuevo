import { IsString, IsArray, IsNotEmpty, IsDefined, IsOptional, ArrayNotEmpty } from 'class-validator';

export class CrearPrestamo {
    @IsArray({
        message: "Envie los alumnos com un arreglo",
    })
    @IsDefined({
        message: "Debe de haber al menos un alumno registrado"
    })
    @ArrayNotEmpty({
        message: "Debe de haber al menos un alumno registrado"
    })
    public alumnos!: [];

    @IsDefined({
        message: "Debe de haber al menos un equipo en el prestamo"
    })
    @ArrayNotEmpty({
        message: "Debe de haber al menos un equipo en el prestamo"
    })
    @IsArray({
        message: "Envie la lista de prestamos como un arreglo"
    })
    public equipo!: Array<any>;

    @IsDefined({
        message: "El laboratorio es obligatorio"
    })
    @IsNotEmpty({
        message: "El laboratorio es obligatorio"
    })
    @IsString({
        message: "Envie solo el id del laboratorio"
    })
    public laboratorio!: string;

    @IsOptional()
    @IsString({
        message: "Envie solo el nombre de la mesa"
    })
    public mesa?: string;
}