import axios from 'axios';

export async function SignIn(params) {
    const url = `/usuarios/crear/empleado`;

    try {
        const respuesta = await axios.post(url, params);

        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw 'Unexpected error';

        return respuesta.data;
    } catch(error) {
        console.error(error);
        throw error;
    }
}