import axios from 'axios'

export async function listar(tipo, lab) {
    const url = `equipo/tipo/${tipo}/${lab}`
    const response = await axios.get(url, {})
    
    return response.data.eqps
}

export async function guardar(equipo, laboratorio, imagen, crear) {
    let guardado = true
    let errores
    let error_imagen = false

    const url = crear? `equipo/crear` : `equipo/editar`

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

    return { guardado, msg, error_imagen }
}

export async function eliminar(id, laboratorio) {
    const url = `equipo/eliminar/${id}/${laboratorio}`
    
    const data = {
        id,
        laboratorio,
    }

    const response = await axios.delete(url, data)

    console.log(response);

    if(response.status === 200 || response.data.status ===  200) { 
        return false;
    }

    return true;

}