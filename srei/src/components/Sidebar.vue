<template>
    <div class="col-lg-2 " id="sidebar-wrapper">
        <div class="row h-25 border-bottom border-dark align-items-center " id="sidebar-header">
            <div class="px-5">
                <div class="px-3">
                    <img src="@/assets/sidebar/user-default.png" class="img-fluid">
                </div>
            </div>
            
                <div class="dropdown text-end">
                    <a class="dropdown-toggle text-decoration-none text-white" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <span class="text-white">{{usuario.nombre}}</span>
                    </a>

                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a class="dropdown-item" href="#" @click="logout">Cerrar sesión</a></li>
                    </ul>
                </div>
            
        </div>
       <div class="row h-75 ">
            <div class="my-1 my-md-2">
                <ul class="list-unstyled mb-0 py-5 px-3 pt-md-3 ">
                    <li class="mb-2 row list-element">
                        <div class="col-12 text-start">
                            <fa-icon :icon="['fas', 'book']" color="white" />
                            <router-link :to="{name: 'bitacora'}" class="btn d-inline-flex text-white">Bitácora</router-link>
                        </div>
                    </li>
                    <li class="mb-2 row list-element"> 
                        <div class="col text-start">
                            <fa-icon :icon="['fas', 'list']" color="white" />
                            <a class="btn d-inline-flex text-white"
                                :class="{collapsed: !inventario}"
                                href='#catalogos-collapse'
                                data-bs-toggle='collapse'
                                :aria-expanded="inventario">Inventarios</a>
                        </div>
                        
                        <div class=" py-2" id="catalogos-collapse"
                            :class="{collapse: !inventario}">
                            <ul class="list-unstyled text-start ps-3">
                                <li class="mb-2 row list-element">
                                    <div class="col text-start">
                                        <fa-icon :icon="['fas', 'bolt']" color="white" />
                                        <router-link 
                                            :to="{name: 'inventario', params:{tipo: 'Electronica'}}" 
                                            :key="$route.path"
                                            class="btn d-inline-flex text-white">Electónica</router-link>
                                    </div>
                                </li>
                                <li class="mb-2 row list-element">
                                    <div class="col text-start">
                                        <fa-icon :icon="['fas', 'microchip']" color="white" />
                                        <router-link
                                            :to="{name: 'inventario', params:{tipo: 'Tarjeta Programable'}}" 
                                            :key="$route.path"
                                            class="btn d-inline-flex text-white">Tarjetas Programables</router-link>
                                    </div>
                                </li>
                                <li class="mb-2 row list-element">
                                    <div class="col text-start">
                                        <fa-icon :icon="['fas', 'cogs']" color="white" />
                                        <router-link 
                                            :to="{name: 'inventario', params:{tipo: 'Maquinaria'}}" 
                                            :key="$route.path"
                                            class="btn d-inline-flex text-white">Maquinaria</router-link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="mb-2 row list-element">
                        <div class="col-12 text-start">
                            <fa-icon :icon="['fas', 'book']" color="white" />
                            <router-link :to="{name: 'catalogos'}" class="btn d-inline-flex text-white">Catálogos</router-link>
                        </div>
                    </li>
                </ul>
            </div>
       </div>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    computed: {
        inventario: function() {
            const route = this.$route.path

            if (route.includes('inventario')) return true
            return false
        },
        usuario: function() {
            return this.$store.getters.usuario
        },
        catalogos: function() {
            const route = this.$route.path

            if (route.includes('catalogos')) return true
            return false
        },
    },
    methods: {
        logout() {
            console.log('login out')
            localStorage.removeItem('usr_token')
            this.axios.defaults.headers.common['Authorization'] = ''

            this.$router.push('/login')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

#sidebar-wrapper {
    --w: 35vh;
}

#sidebar-wrapper {
    position: sticky;
    top: 0%;
    z-index: 1;
    min-height: 100vh;
    height: 100vh;
    background-color: #3796b1;
}

#sidebar-header {
    background-image: url('../assets/sidebar/sidebar-bg.png');
    background-size: var(--w);
}
</style>