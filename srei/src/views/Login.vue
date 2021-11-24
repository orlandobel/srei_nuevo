<template>
    <div class="container-fluid bg">
        <div class="row h-100 justify-content-center">
            <div class="col-xl-3 col-xxl-2 align-self-center">
                <div class="card">
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
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            rfc: '',
            password: '',
        }
    },
    methods: {
        login() {
            const params = {
                usuario: this.rfc,
                clave: this.password
            }

            const headers = {
                'Content-Type': 'application/json'
            }

            this.axios('/API_SREI/usuarios/login/test', { params, headers }).then(res => {
                console.log(res)
                localStorage.setItem("usuario", res.data.usuario)

                this.rfc = ''
                this.password= ''
            }).catch(err => {
                console.log(err)
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../node_modules/bootstrap/scss/functions';
@import '../styles/_variables';

.bg {
    background-color: $red-600;
}
.container-fluid {
    height: 100vh;
}
</style>