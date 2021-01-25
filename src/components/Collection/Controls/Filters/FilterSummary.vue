<template>
    <div>
        <div class="filter-tags">
            <FilterTag v-for="(tag, index) in tags" :key="index" v-on:delete-me="deleteChild(index)"></FilterTag>
            <button @click="addFilter">+</button>
        </div>
        <button>OR</button>
    </div>
</template>
<script>
import FilterTag from './FilterTag.vue'
export default {
    name: 'FilterSummary',
    props: {
        value: {}
    },
    components: {
        FilterTag,
    },
    data() {
        return {
            tags: this.value
        }
    },
    props: {
        value: {
            required: true
        },
    },
    mounted() {
      
    },
    methods: {
       addFilter() {
           this.tags.push('FilterTag')
       },
       deleteChild(index) {
           this.tags.splice(index, 1)
       }
    },
    watch: {
        value() {
            this.tags = this.value
        }
    }
}
</script>
<style lang="scss">
.filter-tags {
    display: flex;
    align-items: center;
}
</style>