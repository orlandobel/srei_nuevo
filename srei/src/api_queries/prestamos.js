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