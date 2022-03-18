import axios from 'axios'

export async function listaSimple() {
    const url = `laboratorios/simple`
    const respuesta = await axios.get(url, {})
    
    return respuesta.data.labs
}

export async function listarAlumnosMesa(laboratorio) {
    const url = `/mesas/alumnos/${laboratorio}`;

    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw "Error inesperado cuando se listaban los alumnos en el laboratorio";
        }

        return respuesta.data.mesas;
    } catch (error) {
        console.error(error)
        throw error;
    }
}