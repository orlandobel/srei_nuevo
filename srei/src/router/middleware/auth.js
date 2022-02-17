import axios from 'axios'

function logout(store, path, next) {
    localStorage.removeItem('usr_token')

    store.dispatch('nextPath', path)
    next({name: 'login'})
}

export default async function isLogged({to, next, store}) {
    if(localStorage.getItem('usr_token') === null) logout(store, to.fullPath, next);
    else 
        try {
            const response = await axios.post('usuarios/login/verify');
            
            if(response.data.login) { // data.login describe si el token a cadicado o no
                if(store.getters.usuario === null || store.getters.usuario === undefined) {
                    store.dispatch('usuario', response.data.usuario)
                    store.dispatch('laboratorio', response.data.laboratorio)
                }
                next() 
            }
            else logout(store, to.fullPath, next)
        } catch(error) {
            logout(store, to.name, next)
        }
}