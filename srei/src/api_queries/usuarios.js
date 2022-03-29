import axios from 'axios';

export async function SignIn(params) {
    const url = `/usuarios/crear/empleado`;

    try {
        const respuesta = await axios.post(url, params);

        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw 'Unexpected error';

        return respuesta.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function listarAlumnos() {
    const url = '/usuarios/alumnos/listar';

    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw "Error inesperado en lista de alumnos";
        }

        return respuesta.data.alumnos;
    } catch(error) {
        console.error(error);
        throw error
    }
}

export async function listarEmpleados() {
    const url = '/usuarios/empleados/listar';

    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw "Error inesperado en lista de empleados/trabajadores";
        }

        return respuesta.data.empleados;
    } catch(error) {
        console.error(error);
        throw error
    }
}

export async function cambiarVetado(alumno, laboratorio, vetado) {
    const url = '/usuarios/vetado/actualizar';

    const data = {
        alumno,
        laboratorio,
        vetado
    }

    try {
        const respuesta = await axios.put(url, data);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw "Error inesperado al actualizar el veto del alumno";
        }

        return respuesta.data.alumno;
    } catch(error) {
        console.error(error);
        throw error
    }
}