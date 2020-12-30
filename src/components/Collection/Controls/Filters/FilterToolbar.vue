<template>
    <div class="filter-toolbar">
        <button>Save</button>
        <FilterSummary v-model="filters"></FilterSummary>
        <button @click="clearFilters">X</button>
    </div>
</template>
<script>
import FilterSummary from './FilterSummary.vue'
export default {
    name: 'FilterToolbar',
    props: {

    },
    components: {
        FilterSummary,
    },
    data() {
        return {
            filters: ['one'],
        }
    },
    mounted() {
      
    },
    methods: {
       clearFilters() {
           console.log('clearfilters', this.filters)
           this.filters = []
       }
    }
}
</script>
<style lang="scss">
.filter-toolbar {
    background: #988;
    display: flex;
}
</style>