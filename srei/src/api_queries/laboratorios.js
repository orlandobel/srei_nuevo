import axios from 'axios'

export async function listaSimple() {
    const url = `laboratorios/simple`
    const respuesta = await axios.get(url, {})
    
    return respuesta.data.labs
}

export async function listarMesas(laboratorio) {
    const url = `/mesas/prestamos/${laboratorio}`;

    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado al listar las mesas del laboratorio"];
        }

        return respuesta.data.mesas;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function listarAlumnosMesa(laboratorio) {
    const url = `/mesas/alumnos/${laboratorio}`;
    
    try {
        const respuesta = await axios.get(url);
        
        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado cuando se listaban los alumnos en el laboratorio"];
        }

        return respuesta.data.mesas;
    } catch (error) {
        throw manageErrors(error);
    }
}

function manageErrors(error) {
    if(error.response) {
        if(error.response.status < 500) return [error.response.data.mensaje];
        else return ["Error inesperado en el servidor"];
    }

    const mensajes = error.split(",");
    return mensajes;
}