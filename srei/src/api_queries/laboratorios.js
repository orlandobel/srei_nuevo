import axios from 'axios'

export async function listaSimple() {
    const url = `laboratorios/simple`
    const response = await axios.get(url, {})
    
    return response.data.labs
}