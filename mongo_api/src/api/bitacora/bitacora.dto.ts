import { IsString, IsArray, IsNotEmpty, IsDefined, IsOptional } from 'class-validator';

export class CrearPrestamo {
    @IsDefined({
        message: "Debe de haber al menos un alumno registrado"
    })
    @IsNotEmpty({
        message: "Debe de haber al menos un alumno registrado"
    })
    @IsArray({
        message: "Envie los alumnos com un arreglo"
    })
    public alumnos!: Array<any>;

    @IsDefined({
        message: "Debe de haber al menos un equipo en el prestamo"
    })
    @IsNotEmpty({
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

    @IsDefined({
        message: "La mesa es obligatoria"
    })
    @IsNotEmpty({
        message: "La mesa es obligatoria"
    })
    @IsString({
        message: "Envie solo el nombre de la mesa"
    })
    @IsOptional()
    public mesa!: string;
}