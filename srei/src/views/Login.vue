<template>
    <div class="row bg vh-100 justify-content-center">
        <div class="col-xl-3 col-xxl-2 align-self-center">
            <div class="card">
                <div v-if="errorMsg !== ''" class="alert alert-danger">
                    <strong>¡Error!</strong> {{errorMsg}}
                </div>
                <h5 class="card-header">Login</h5>
                <div class="card-body px-4">
                    <form action @submit.prevent="login">
                        <div class="row mb-2">
                            <label for="rfc" class="form-label text-start">RFC</label>
                            <input type="text" name="rfc" id="rfc" class="form-control" v-model="rfc">
                        </div>
                        <div class="row mb-3">
                            <label for="password" class="form-label text-start">Contraseña</label>
                            <input type="password" name="password" id="password" class="form-control" v-model="password">
                        </div>
                        <div class="row justify-content-end pe-xl-2 pe-xxl-3">
                            <div class="col-xl-3">
                                <button class="btn btn-primary btn-rounded">Entrar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            rfc: '',
            password: '',
            errorMsg: '',
        }
    },
    methods: {
        async login() {
            const params = {
                usuario: this.rfc,
                clave: this.password
            }

            try {
                const response = await this.axios.post('usuarios/login/test', params)

                this.$store.dispatch('usuario', response.data.usuario)
                localStorage.setItem('usr_token', response.data.token)
                this.axios.defaults.headers.common['Authorization'] = response.data.token


                const nextPath = this.$store.getters.nextPath;

                this.$store.dispatch('nextPath', '/')
                this.$store.dispatch('usuario', response.data.usuario)
                this.$store.dispatch('laboratorio', response.data.laboratorio)

                this.$router.push(nextPath)
            } catch(error) {
                const response = error.response
                let status = response.status 
                if (status == 404) this.errorMsg = "Las credenciales son incorrectas, favor de comprobar su usuario y contraseña sean correctos"
                if (params.usuario == "") this.errorMsg += "\n Asegúrese de escribir su nombre de usuario"
                if (params.clave == "") this.errorMsg += "\n Asegúrese de escribir su contraseña única"
            }
        },
    },
    mounted() {
        this.$store.dispatch('usuario', null)
        this.$store.dispatch('laboratorio', null)
    }
}
</script>

<style lang="scss" scoped>
@import '../../node_modules/bootstrap/scss/functions';
@import '../styles/_variables';

.bg {
    background-color: $red-600;
}
</style>