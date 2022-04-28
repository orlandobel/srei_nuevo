import axios from 'axios'

export async function listar(tipo, lab) {
    const url = `equipo/tipo/${tipo}/${lab}`
    const response = await axios.get(url, {})
    
    return response.data.eqps
}

export async function imagen(ruta) {
    try {
        const url = `equipo/${ruta}/qr.png`;
        const response = await axios.get(url);

        if(response.status >= 400)
            throw null;

        return response.data
    } catch(error) {
        throw null;
    }
}

export async function guardar(equipo, laboratorio, imagen, crear) {
    let guardado = true
    let errores
    let error_imagen = false

    const url = crear? `/equipo/crear` : `/equipo/editar`

    const eqp_data = {
        eqp: equipo,
        laboratorio,
    }

    const eqp_response = crear? await axios.post(url, eqp_data) : await axios.put(url, eqp_data)
    
    if(eqp_response.status != 200 || eqp_response.data.status != 200) {
        guardado = false

        const msg = eqp_response.data.mensaje.substr(5)
        errores = msg.split(',')

        if(errores.length > 1 && errores[1].includes('caracteristicas')) {
            errores[1] = errores[1].split(': ')[1]
        }

        return { guardado, errores}
    }

    const msg = crear? "Equipo creado con exito": "Cambios guardados"
    
    if(imagen != null && imagen != undefined) {
        const img_data = new FormData()

        img_data.append('ruta', eqp_response.data.ruta)
        img_data.append('id', eqp_response.data.eqp.id)
        img_data.append('imagen', imagen)

        const headers = {'Content-Type': 'multipart/form-data'}
        const img_response = await axios.post('equipo/imagenes', img_data, headers)

        if(img_response.status != 200 || img_response.data.status != 200)
            error_imagen = true
    }

    return { guardado, msg, error_imagen, eqp: eqp_response.data.eqp }
}

export async function eliminar(ruta) {
    const url = `equipo/eliminar/${ruta}`
    
    try {
        const response = await axios.delete(url)
        
        if(response.status >= 400 || response.data.status >= 400) { 
            throw ["Error al intentar eliminar el equipo"];
        }
    
        return true;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function pdf(laboratorio, tipo){
    try {
        const url = `equipo/pdf/${laboratorio}/${tipo}`;
        const response = await axios.get(url)

        console.log(response);
        if(response.status >= 400) { 
            throw response.status;
        }

        return response
    } catch (error) {
        console.error(error);
        throw response.status;
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