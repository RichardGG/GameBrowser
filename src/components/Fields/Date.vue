<template>
    <input type="date" v-model="date">
</template>
<script>
export default {
    data() {
        return {date: 0}
    },
    props: {
        value: {
            type: Number,
            required: true
        }
    },
    watch: {
        date() {
            this.$emit('input', new Date(this.date).getTime())
        }
    }
}
</script>