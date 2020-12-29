<template>
    <div>
        Collection
        <GameList :games="games"></GameList>
    </div>
</template>
<script>
import GameList from'./GameList/GameList.vue'
export default {
    name: 'Collection',
    props: {
        games: {
            type: Array
        },
    },
    components: {
        GameList
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