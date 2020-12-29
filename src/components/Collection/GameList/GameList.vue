<template>
    <div>
        GameList
        <Game v-for="game in games" :key="game.meta.gogId" :game="game"></Game>
    </div>
</template>
<script>
import Game from'./Game.vue'
export default {
    name: 'GameList',
    props: {
        games: {
            type: Array
        }
    },
    components: {
        Game
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