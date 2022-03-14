import axios from 'axios';

export async function initView(laboratorio) {
    const url_mesas = `/mesas/prestamos/${laboratorio}`;
    const url_alumnos = '/usuarios/alumnos/listar';

    try {
        const res_mesas = await axios.get(url_mesas);
        const res_alumnos = await axios.get(url_alumnos);
        
        if(res_mesas.status >= 400 || res_mesas.data.status >= 400)
            throw 'Unexpected error while obtaining "Mesas"';
        
        if(res_alumnos.status >= 400 || res_alumnos.data.status >= 400)
            throw 'Unexpected error in while obtaining "Alumnos"'
        
        const res = {
            mesas: res_mesas.data.mesas,
            alumnos: res_alumnos.data.alumnos,
        };
        
        return res;
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

export async function consultaDae(url, laboratorio) {
    try {
        const respuesta_dae = await axios.post('/usuarios/consulta/dae', { url });
        
        if(respuesta_dae.status >= 400 || respuesta_dae.data.status >= 400)
            throw "Unexpected error in 'consulta dae";

        const alumno = respuesta_dae.data.alumno
        const respuesta_vetado = await axios.post('/usuarios/vetado/consulta', { alumno, laboratorio });

        if(respuesta_vetado.status >= 400 || respuesta_vetado.data.status >= 400)
            throw "Unexpected error in 'vetado'"
            
        return respuesta_vetado.data;
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

export async function prestamosDia(laboratorio) {
    const url = `/prestamo/consulta/dia/${laboratorio}`;

    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(resouesta.data);
            throw "Unexpected error";
        }
        
        return respuesta.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function regresarPrestamo(id) {
    const url = `/prestamo/entregar`;

    try {
        const respuesta = await axios.put(url, { id });

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw "Unexpected error";
        }

        return respuesta.data.prestamo;
    } catch(error) {

    }
}