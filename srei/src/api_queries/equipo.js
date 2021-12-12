import axios from 'axios'

export async function listar(tipo, lab) {
    console.log(lab)
    const url = `equipo/tipo/${tipo}/${lab}`
    const response = await axios.get(url, {})
    return response.data.eqps
}