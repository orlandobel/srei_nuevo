<template>
    <div class="position-absolute w-auto">
            <div class="alert alert-success" role="alert" v-if="success">
                {{ mensaje }}
            </div>

            <div class="alert alert-danger mb-1" role="alert" 
                v-else v-for="e in errors" :key="e">
                {{ e }}
            </div>
        </div>
</template>

<script>
export default {
    name: 'ApiMessage',
    props: {
        mensaje: { type: String, required: true },
        success: { type: Boolean, required: true }
    },
    data() {
        return {
            errors: []
        }
    },
    methods: {
        displayErrors(errors) {
            let timeout = 3000;
            this.errors = errors
            
            errors.forEach(() => {
                setTimeout(() => this.errors.shift(), timeout);
                timeout += 1000;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.alert {
    z-index: 1000;
}
</style>