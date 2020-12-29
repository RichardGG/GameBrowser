<template>
    <div>
        <Collection :games="games"></Collection>
    </div>
</template>
<script>
import axios from 'axios'
import Collection from'./components/Collection/Collection.vue'
export default {
    components: {
        Collection
    },
    data() {
        return {
            games: [], // The full list of game data
        }
    },
    mounted() {
        // Load the game data
        axios.get('/static/output/games.json').then(response => {
            this.games = response.data.games
        })
    },
    methods: {
       
    }
}
</script>
<style lang="scss">
body {
    background: #088;
}
</style>