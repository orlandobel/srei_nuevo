import axios from 'axios'

export async function listar(tipo, lab) {
    const url = `equipo/tipo/${tipo}/${lab}`
    const response = await axios.get(url, {})
    
    return response.data.eqps
}

export async function guardar(equipo, laboratorio, imagen, crear) {
    const url = crear? `equipo/crear` : `equipo/editar`

    const eqp_data = {
        eqp: equipo,
        laboratorio,
    }

    console.warn(eqp_data)

    const eqp_response = crear? await axios.post(url, eqp_data) : await axios.put(url, eqp_data)
    if(eqp_response.status != 200 || eqp_response.data.status != 200){
        console.error(eqp_response)
        return false
    }
    
    if(imagen != null && imagen != undefined) {
        const img_data = new FormData()
        img_data.append('ruta', eqp_response.data.ruta)
        img_data.append('id', eqp_response.data.eqp.id)
        img_data.append('imagen', imagen)

        const headers = {'Content-Type': 'multipart/form-data'}
        const img_response = await axios.post('equipo/imagenes', img_data, headers)

        if(img_response.status != 200 || img_response.data.status != 200)  {
            console.error(img_response)
            return false
        }
    }

    return true
}