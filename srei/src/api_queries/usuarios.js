import axios from 'axios';

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