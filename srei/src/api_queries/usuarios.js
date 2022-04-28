import axios from 'axios';

export async function SignUp(params) {
    const url = `/usuarios/crear/empleado`;

    try {
        const respuesta = await axios.post(url, params);

        if(respuesta.status >= 400 || respuesta.data.status >= 400)
            throw 'Error inesperado';

        return respuesta.data;
    } catch(error) {
        if(error.response) {
            if(error.response.status < 500) throw error.response.data.mensaje;
            else throw "Error inesperado en el servidor";
        }

        throw error;
    }
}

export async function listarAlumnos() {
    const url = '/usuarios/alumnos/listar';
    
    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw ["Error inesperado en lista de alumnos"];
        }

        return respuesta.data.alumnos;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function listarEmpleados() {
    const url = '/usuarios/empleados/listar';

    try {
        const respuesta = await axios.get(url);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw ["Error inesperado en lista de empleados/trabajadores"];
        }

        return respuesta.data.empleados;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function cambiarVetado(alumno, laboratorio, vetado) {
    const url = '/usuarios/vetado/actualizar';

    const data = {
        alumno,
        laboratorio,
        vetado
    }

    try {
        const respuesta = await axios.put(url, data);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado al actualizar el veto del alumno"];
        }

        return respuesta.data.alumno;
    } catch(error) {
        throw manageErrors(error)
    }
}

export async function toggleTipo( empleado, tipo){
    const url = '/usuarios/empleados/actualizar';
    const data = {
        empleado,
        tipo       
    }
    
    try {
        const respuesta = await axios.put(url, data);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            console.error(respuesta);
            throw ["Error inesperado al actualizar permisos de administracion"];
        }
        
        return respuesta.data.empleado;
    } catch(error) {
        throw manageErrors(error);
    }

}

export async function aceptar( empleado ){
    const url = '/usuarios/empleados/enEspera';
    const data = {
        empleado     
    }
    
    try {
        const respuesta = await axios.put(url, data);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado al actualizar estado de trabajador"];
        }
        
        return respuesta.data.empleado;
    } catch(error) {
        throw manageErrors(error)
    }

}

export async function eliminarEmpleado (id){
    const url = `/usuarios/empleados/eliminar/${id}`;
    try {
        const response = await axios.delete(url)
        console.log(response);
    
        if(response.status != 200 || response.data.status !=  200) { 
            throw ["Error inesperado al eliminar el empleado"];
        }
    
        return true;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function cambiarClave(data) {
    const url = '/usuarios/clave/actualizar';

    try {
        const respuesta = await axios.put(url, data);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado al actualizar la contraseña"];
        }

        return;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function claveOlvidada(rfc) {
    const url = '/usuarios/clave/olvidada';

    try {
        const respuesta = await axios.put(url, { usuario: rfc });

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado al envíar el correo de recuperación"];
        }

        return respuesta.data.mensaje;
    } catch(error) {
        throw manageErrors(error);
    }
}

export async function recuperarClave(token, clave) {
    const url =  '/usuarios/clave/recuperar';

    try {
        const data = {
            clave
        };

        const config = {
            headers: {
                reset: token
            }
        };

        const respuesta = await axios.put(url, data, config);

        if(respuesta.status >= 400 || respuesta.data.status >= 400) {
            throw ["Error inesperado recuperando la contraseña"];
        }

        return "Clave actualizada";
    } catch(error) {
        throw manageErrors(error);
    }
}

function manageErrors(error) {
    console.log(error.response);
    if(error.response) {
        if(error.response.status < 500) return [error.response.data.mensaje];
        else return ["Error inesperado en el servidor"];
    }

    const mensajes = error.split(",");
    return mensajes;
}