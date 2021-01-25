t<template>
    <div class="filter-tag">
        FilterTag <span @click="deleteMe">X</span>
    </div>
</template>
<script>
export default {
    name: 'FilterTag',
    props: {

    },
    components: {
    },
    data() {
        return {
      
        }
    },
    mounted() {
      
    },
    methods: {
       deleteMe() {
           this.$emit('delete-me')
       }
    }
}
</script>
<style lang="scss">
.filter-tag {
    display: block;
    padding: 5px;
    background: #ccc;
    border: 1px solid black;
    border-radius: 4px;
    margin: 0px 5px;
}
</style>