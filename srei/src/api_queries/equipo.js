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

    const eqp_response = await axios.post(url, eqp_data)
    console.log(eqp_response)
    if(eqp_response != 200 || eqp_response.data.status != 200)
        console.log('error')
    
    if(imagen != null) {
        const img_data = new FormData()
        img_data.append('ruta', eqp_response.data.ruta)
        img_data.append('imagen', imagen)

        const headers = {'Content-Type': 'multipart/form-data'}
        const img_response = await axios.post('equipo/imagenes', img_data, headers)

        if(img_response != 200 || img_response.data.status != 200)
            return false
    }

    return true
}