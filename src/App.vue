<template>
    <div>
        <Nav 
            :fields="fields"
            :operations="operations" 
            @sortUpdated="sortUpdated"
            @sortDirectionUpdated="sortDirectionUpdated"
            @scaleUpdated="scaleUpdated"
            @filtersUpdated="filtersUpdated"
            @setTag="setTag"
            @shuffleGames="shuffleGames"
        ></Nav>
        <input type="file" @change="fileChanged">
        <div class="games-area">
            {{ filteredGames.length }} Games
            <div class="games">
                <Game 
                    v-for="game in filteredGames"
                    :key="game.meta.gogId"
                    :game="game"
                    :sort="sort"
                    :sortType="fields[sort].type"
                    :fields="fields"
                    :operations="operations"
                    @gameClicked="gameClick(game)"
                    :scale="scale"
                    :selected="isSelected(game)"
                    @toggleSelect="toggleSelect(game)"
                    :output="rerenderHack"

                ></Game>
                
            </div>
        </div>
        <div class="game-modal" v-if="displayedGame">
            <GameModal :game="displayedGame" @closeModal="displayedGame = null"></GameModal>
        </div>
    </div>
</template>
<script>
import Nav from './components/Nav/Nav.vue'
import Game from './components/Game/Game.vue'
import GameModal from './components/Game/GameModal.vue'
import _ from 'lodash'
import axios from 'axios'
import jsonLogic from 'json-logic-js'
// import {google} from 'googleapis'
import '../assets/style.scss'
import 'vue-select/src/scss/vue-select.scss'
import fields from './schema/fields.json'
import operations from './schema/operations.json'

export default {
    components: {
        Nav,
        Game,
        GameModal,
    },
    data() {
        return {
            games: [],
            filteredGames: [],
            useFilters: true,
            
            fields: fields,
            operations: operations,

            displayedGame: null,

            sort: 'user.lastPlayed',
            sortDirection: true,

            currentFilter: {
                "in" : [
                    '',
                    'searchTitle'
                ]
            },

            scale: 1,

            selectedGames: {},

            rerenderHack: Date.now(),
        }
    },
    mounted() {

        // initGoogleDrive()

        jsonLogic.add_operation("!in", (a,b) => {
            return jsonLogic.apply(
                {"!": [{"in": [a, b]}]},
            )
        })
        jsonLogic.add_operation("empty", (a,b) => {
            return !b
        })

        // load games
        axios.get('/static/output/games.json').then(response => {
            this.games = response.data.games

            const numSorts = []
            _.forIn(this.fields, (field) => {
                if (field.sortable && ['Date', 'Number', 'Percent', 'SteamRating'].includes(field.type)) {
                    numSorts.push(field.code)
                }
            })

            // Update game information
            _.forIn(this.games, (game, key) => {
                // Fixes for searching
                game.searchTitle = game.title.toLowerCase()
                // Fixes for sorting
                for (const path of numSorts) {
                    if (!_.isNumber(_.get(game, path))) {
                        _.set(game, path, 'NA')
                    }
                }
                _.set(game, 'random', Math.random())
            })
            this.filteredGames = this.games

            // Get the values for fields
            _.forEach(this.fields, (field) => {
                if (!field.fetch) {
                    return
                }
                // get all the values eg: info.developers
                let values = {}
                _.forEach(this.games, (game) =>{
                    let value = _.get(game, field.code)
                    if (_.isEmpty(value)) {
                        return
                    }
                    if (!_.isArray(value)) {
                        value = [value]
                    }
                    _.forEach(value, (val) => {
                        if (values[val]) {
                            values[val]++
                        } else {
                            values[val] = 1
                        }
                    })
                })
                field.values = []
                 _.forIn(values, (value, key) => {
                    field.values.push({
                        label: key + ' (' + value + ')',
                        code: key,
                    })
                })
                field.values = field.values.sort((a,b) => {
                    const aC = parseInt(a.label.split('(')[1])
                    const bC = parseInt(b.label.split('(')[1])
                    return bC - aC
                })
            })
            this.filtersUpdated(this.currentFilter)
        })
    },
    methods: {
        // @vuese
        // TODO set tag for selected items
        setTag(tagName) {
            console.log(tagName)
        },
        // @vuese
        // check if game is selected
        isSelected(game) {
            return _.get(this.selectedGames, _.get(game, 'meta.gogId'), false)
        },
        // @vuese
        // toggle selected for game
        toggleSelect(game) {
            const gogId = _.get(game, 'meta.gogId')
            _.set(this.selectedGames, gogId, !(_.get(this.selectedGames, gogId, false)))
            this.rerenderHack = Date.now()
        },
        // @vuese
        // Run the filter against the gamelist
        filtersUpdated(filter) {
            this.currentFilter = filter
            const cleanedFilters = JSON.parse(JSON.stringify(this.currentFilter))
            // this.cleanFilters(cleanedFilters)
            this.filteredGames = _.filter(this.games, (game) => {
                if (!this.useFilters) {
                    return true
                }
                // replace tokens in filters
                const filtersJson = JSON.stringify(cleanedFilters)
                const replacedFilters = JSON.parse(filtersJson)
                this.replaceFilters(game, replacedFilters)

                const apply = jsonLogic.apply(replacedFilters)
                return apply
            })
            if (['Date', 'Percent', 'SteamRating', 'Number'].includes(this.fields[this.sort].type)) {
                this.filteredGames = this.filteredGames.sort((a,b) => {
                    const aVal = _.get(a, this.sort)
                    const bVal = _.get(b, this.sort)
                    // Number sorting
                    if (aVal === bVal) {
                        return 0
                    }
                    if (aVal === 'NA') {
                        return 1
                    }
                    if (bVal === 'NA') {
                        return -1
                    }
                    if (this.sortDirection) {
                        return bVal - aVal
                    }
                    return aVal - bVal
                })
            } else {
                this.filteredGames = this.filteredGames.sort((a,b) => {
                    let aVal = _.get(a, this.sort)
                    let bVal = _.get(b, this.sort)
                    // String sorting
                    aVal = typeof aVal === 'string' ? aVal.toLowerCase() : aVal 
                    bVal = typeof bVal === 'string' ? bVal.toLowerCase() : bVal
                    if (aVal > bVal) {
                        return this.sortDirection ? -1 : 1;
                    }
                    if (aVal < bVal) {
                        return this.sortDirection ? 1 : -1;
                    }
                    return 0
                })
            }
            setTimeout(() => {
                this.$Lazyload.lazyLoadHandler()
            }, 100)
        },
        // @vuese
        // REMOVE No longer done on this component
        cleanFilters(filters) {
            // Remove the "rule" property needed for vue
            for (const key in filters) {
                if (['or', 'and'].includes(key)) {
                    for (const index in filters[key]) {
                        filters[key][index] = filters[key][index].rule
                        this.cleanFilters(filters[key][index])
                    }
                }
            }
        },
        // @vuese
        // Replace tokens on filter (get details from game)
        replaceFilters(game, filters) {
            for (const key in filters) {
                if (['or', 'and', '!'].includes(key)) {
                    for (const rule of filters[key]) {
                        this.replaceFilters(game, rule)
                    }
                } else {
                    filters[key][1] = _.get(game, filters[key][1])
                }
            }
        },
        // @vuese
        // Set new random number on each game
        shuffleGames() {
            _.forEach(this.games, (game) => {
                game.random = Math.random()
            })
            this.filtersUpdated(this.currentFilter)
        },
        // @vuese
        // Set this displayedGame
        gameClick(game) {
            this.displayedGame = game
        },
        // @vuese
        // Update sort
        sortUpdated(sort) {
            this.sort = sort
            this.filtersUpdated(this.currentFilter)
        },
        // @vuese
        // Update sort direction
        sortDirectionUpdated(direction) {
            this.sortDirection = direction
            this.filtersUpdated(this.currentFilter)
        },
        // @vuese
        // DUPLICATE Update sort
        sortUpdated(sort) {
            this.sort = sort
            this.filtersUpdated(this.currentFilter)
        },
        // @vuese
        // Update scale
        scaleUpdated(scale) {
            this.scale = scale
        }
    }
}
</script>
<style lang="scss">
.games-area {
    margin-top: 70px;
    color: rgba(255,255,255,0.5);
    text-align: center;
    .games {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-around;
    }
}
</style>