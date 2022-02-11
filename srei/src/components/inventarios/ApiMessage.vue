<template>
    <div class="alert d-flex align-items-center" :class="error? 'alert-danger': 'alert-success'" role="alert">
        <div>
            {{message}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'ApiMessage',
    data() {
        return {
            error: this.error_bind,
            message: this.message_bind,
        }
    },
    props: {
        error_bind: { type: Boolean, required: true },
        message_bind: { typea: String, required: true },
    }
}
</script>