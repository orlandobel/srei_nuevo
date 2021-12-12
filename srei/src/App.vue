<template>
    <div class="container-fluid" id="main">
        <router-view />
    </div>
</template>

<style lang="scss">
@import './styles/_variables.scss';

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

#main {
    background-color: rgb(233, 233, 233);
}

::-webkit-scrollbar {
    width: 10px;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background-color: $red-600;
    border-radius: 3px;
}
</style>
