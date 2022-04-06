import axios from 'axios';

export async function consultaDisponibilidad(id) {
    const url = `/prestamo/${id}`;

    try {
        const respuesta = await axios.get(url);
        
        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw respuesta.status;

        return respuesta.data
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function consultaDae(url, laboratorio) {
    try {
        const respuesta = await axios.post('/usuarios/consulta/dae', { url });
        
        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw ["Error inesperado al consultar al DAE"];

        const alumno = respuesta.data.alumno
        const vetado = await verificarVetado(alumno, laboratorio);
    
        return { alumno, vetado };
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function verificarVetado(alumno, laboratorio) {
    const url = '/usuarios/vetado/consulta'

    try {
        const respuesta = await axios.post(url, { alumno, laboratorio });
        
        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado al consultar el estado de veto del alumno"];
        }

        return respuesta.data.vetado;
    } catch(error) {
        throw manageErrors(error);
    }

}

export async function generarPrestamo(prestamo) {
    const url = '/prestamo/generar';

    try {
        const respuesta = await axios.post(url, prestamo);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta)
            throw ["Error inesperado al generar prestamos"];
        }

        return respuesta.data;
    } catch(error) {
        throw manageErrors(error)
    }
}

export async function prestamosDia(laboratorio) {
    const url = `/prestamo/consulta/dia/${laboratorio}`;
    try {
        const respuesta = await axios.get(url);
        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(resouesta.data);
            throw ["Error inesperado al consultar la vitacora del día"];
        }
        
        return respuesta.data;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function regresarPrestamo(id) {
    const url = `/prestamo/entregar`;

    try {
        const respuesta = await axios.put(url, { id });

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error al regresar el equipo prestado"];
        }

        return respuesta.data.prestamo;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function bitacoraGen(fechaI, fechaO){
    const url = `/prestamo/bitacora/Semestral/${fechaI}/${fechaO}`;

    try {
        const respuesta = await axios.get(url);
        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw ["Error inesperado al generar la bitácora solicitada"];
        
        const arr = respuesta.data.bitacora
        return arr
    } catch(error) {
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