import axios from 'axios';

export async function initView(laboratorio) {
    const url = `/mesas/prestamos/${laboratorio}`;

    try {
        const response = await axios.get(url);

        if(response.status >= 400 || response.data.status >= 400)
            throw 'Unexpected error';

        return response.data.mesas;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function consultaDisponibilidad(id) {
    const url = `/prestamo/${id}`;

    try {
        const respuesta = await axios.get(url);
        
        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw respuesta.status;

        return respuesta.data
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function consultaDae(url) {
    try {
        const respuesta = await axios.post('/usuarios/consulta/dae', { url });
        
        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw "Unexpected error";
            
        return respuesta.data.alumno;
    } catch(error) {
        throw error;
    }
}

export async function generarPrestamo(prestamo) {
    const url = '/prestamo/generar';

    try {
        const respuesta = await axios.post(url, prestamo);

        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw respuesta;
            
        console.log(respuesta)
    } catch(error) {
        if(error.response) {
            throw [error.response.data.mensaje];
        }

        const mensajes = error.data.mensaje.split(',')
        throw mensajes
    }
}

export async function bitacoraGen(fechaI, fechaO){
    const url = `/prestamo/bitacora/Semestral/${fechaI}/${fechaO}`;

    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw respuesta;
        const arr = respuesta.data.bitacora

        return arr
    } catch(error) {
        if(error.response) {
            throw [error.response.data.mensaje];
        }
        const mensajes = error.data.mensaje.split(',')
        throw mensajes
    }
}