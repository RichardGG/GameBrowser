<template>
    <div>
        Controls
        <SortToolbar></SortToolbar>
        <FilterToolbar></FilterToolbar>
    </div>
</template>
<script>
import FilterToolbar from './Filters/FilterToolbar.vue'
import SortToolbar from './SortToolbar.vue'
export default {
    name: 'Collection',
    props: {
        games: {
            type: Array
        },
    },
    components: {
        FilterToolbar,
        SortToolbar,
    },
    data() {
        return {
      
        }
    },
    mounted() {
      
    },
    methods: {
       
    }
}
</script>