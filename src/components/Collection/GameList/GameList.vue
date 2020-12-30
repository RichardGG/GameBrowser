<template>
    <div class="games-list">
        <Game v-for="game in games" :key="game.meta.gogId" :game="game"></Game>
    </div>
</template>
<script>
import Game from'./Game.vue'
export default {
    name: 'GameList',
    props: {
        games: {

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
<style lang="scss">
.games-list {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-around;
}
</style>