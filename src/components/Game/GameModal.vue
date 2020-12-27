<template>
    <div>
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content">
            <div class="columns">
                <Slideshow :images="allImages"></Slideshow>
                <div class="game-info">
                    <button @click="launchGame" style="display: none;">LAUNCH</button>
                    <div>
                        <strong class="game-title">{{ game.title }}</strong>
                        <div class="game-details">
                            <div class="game-description" v-html="game.summary"></div>
                            <div class="fields">
                                <div class="field-details" v-for="(field, index) in displayedFields" :key="'field' + index">
                                    <div class="field-type">{{ field.title }}</div>
                                    <div v-if="field.type == 'Boolean'" class="type-data type-Boolean">
                                        {{ getInfo(field.path) }}
                                    </div>
                                    <div v-if="field.type == 'Date'" class="type-data type-Date">
                                        {{ date(getInfo(field.path)) }}
                                    </div>
                                    <div v-if="field.type == 'Number'" class="type-data type-Number">
                                        {{ getInfo(field.path) }}
                                    </div>
                                    <div v-if="field.type == 'Score'" class="type-data type-Score">
                                        {{ getInfo(field.path) }}%
                                    </div>
                                    <div v-if="field.type == 'Random'" class="type-data type-Random">
                                        {{ getInfo(field.path) }}
                                    </div>
                                    <div v-if="field.type == 'SteamRating'" class="type-data type-SteamRating">
                                        {{ getInfo(field.path) }}
                                    </div>
                                    <div v-if="field.type == 'String'" class="type-data type-String">
                                        {{ getInfo(field.path) }}
                                    </div>
                                    <div v-if="field.type == 'Array'" class="type-data type-Array">
                                        <div class="array-items" :class="{'expanded': field.expanded}">
                                            <div class="array-item" v-for="(a, index) in getInfo(field.path)" :key="'array' + index">
                                                {{ a }}
                                            </div>
                                        </div>
                                        <div class="expand-button" @click="field.expanded = !field.expanded" v-if="!field.expanded">
                                            ...
                                        </div>
                                        <div class="expand-button" @click="field.expanded = !field.expanded" v-if="field.expanded">
                                            ...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import Slideshow from './Slideshow.vue'
export default {
    components: {
        Slideshow
    },
    props: {
        game: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            displayedFields: [
                {
                    title: 'Release Date',
                    path: 'info.releaseDate',
                    type: 'Date',
                },
                {
                    title: 'Last Played',
                    path: 'user.lastPlayed',
                    type: 'Date',
                },
                {
                    title: 'Owned Platforms',
                    path: 'user.ownedPlatforms',
                    type: 'Array',
                    expanded: false,
                },
                {
                    title: 'Critic Score',
                    path: 'reviews.gogCriticsScore',
                    type: 'Score',
                },
                {
                    title: 'Steam Review Score',
                    path: 'reviews.steamPercent',
                    type: 'Score', 
                },
                {
                    title: 'Developers',
                    path: 'info.developers',
                    type: 'Array',
                    expanded: false,
                },
                {
                    title: 'Publishers',
                    path: 'info.publishers',
                    type: 'Array',
                    expanded: false,
                },
                // {
                //     title: 'Themes',
                //     path: 'categories.themes',
                //     type: 'Array',
                //     expanded: false,
                // },
                // {
                //     title: 'Genres',
                //     path: 'categories.genres',
                //     type: 'Array',
                //     expanded: false,
                // },
                // {
                //     title: 'Your Tags (GOG)',
                //     path: 'categories.gogTags',
                //     type: 'Array',
                //     expanded: false,
                // },
                {
                    title: 'Steam User Tags',
                    path: 'categories.steamTags',
                    type: 'Array',
                    expanded: false,
                },
                {
                    title: 'Features',
                    path: 'categories.steamFeatures',
                    type: 'Array',
                    expanded: false,
                },
            ]
        }
    },
    computed: {
        allImages() {
            const gogImages = _.map(this.game.assets.gogScreenshots, (url) => {
                return {
                    url: this.transformGogScreenshot(url),
                    source: 'gog'
                }
            })
            const steamImages = _.map(this.game.assets.steamScreenshots, (url) => {
                return {
                    url: url,
                    source: 'steam'
                }
            })
            return steamImages.concat(gogImages)
        }
    },
    methods: {
        getInfo(path) {
            return _.get(this.game, path)
        },
        date(timestamp) {
            return new Date(timestamp * 1000).toDateString();
        },
        transformGogScreenshot(url) {
            return url.replace('{formatter}', '').replace('{ext}', 'webp')
        },
        closeModal() {
            this.$emit('closeModal')
        },
        launchGame() {
            let platforms = []
            _.forIn(this.game.user.platformDetails, (details, platform) => {
                if (details.installed) {
                    platforms.push(platform)
                }
            })
            if (platforms.length === 1) {
                this.generateLaunchUrl(platforms[0])
            }
        },
        generateLaunchUrl(platform) {
            const formats = {
                steam: 'steam://rungameid/{{gameId}}/',                                     // tested working with automachef
                amazon: 'twitch://fuel-launch/{{gameId}}',                                  // tested working with autonauts
                epic: 'com.epicgames.launcher://apps/{{gameId}}?action=launch&silent=true', // tested working with hue (but slow)
                //gog: 'GALAXYPATH\GalaxyClient.exe" /command=runGame /gameId=IDNUMBER /path="GAMEPATH',
                uplay: 'uplay://launch/{{gameId}}',                                         // ID NOT WORKING? stuck on initializing
                origin: 'origin://launchgame/DR:{{gameId}}',                                // ID NOT WORKING
                // xboxone: 'ms-windows-store://pdp?productId=9MSMJH3C6TKR',                // what is this id???
                // xboxone: 'msgamepass://pdp?productId=9MSMJH3C6TKR',                      // this is probably better
                // "xboxone_1793054097",
                // "xboxone_2093066399
            }
            // TODO releaseKey should be in ownedPlatforms
            const releaseKey = _.find(this.game.meta.releaseKeys, (releaseKey) => {
                return releaseKey.indexOf(platform) === 0
            })
            const url = formats[platform].replace('{{gameId}}', releaseKey.substr(platform.length + 1))
            console.log(url)
            window.location.assign(url)
        }
    }
}
</script>
<style lang="scss">
.game-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    .modal-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
    }
    .modal-content {
        position: relative;
        width: calc(100vw - 200px);
        margin-top: 50px;
        padding: 20px;
        overflow: scroll;
        max-height: calc(100vh - 200px);
        background-color: #111;
        border-radius: 20px;
        overflow: scroll;
        .columns {
            display: flex;
            flex-direction: column;
        }
    }
    .game-info {
        color: white;
        padding: 20px;
    }
    .game-title {
        display: block;
        font-size: 32px;
        margin-bottom: 10px;
    }
    .game-details {
        display: flex;
        .game-description {
            max-width: 600px;
            line-height: 1.5;
            font-size: 17px;
            background: #0e171f;
            font-weight: 100;
            color: white;
            padding: 60px;
        }
        .fields {
            padding: 20px;
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            .field-details {
                margin-right: 20px;
                display: inline-flex;
                width: auto;
                flex-direction: column;
                align-items: flex-start;
                .field-type {
                    margin-top: 15px;
                    margin-bottom: 5px;
                    margin-right: 10px;
                    text-transform: uppercase;
                }
                .type-data {
                    display: flex;
                    align-items: center;
                    &.type-Date {
                        display: inline-block;
                        background: #222;
                        padding: 10px;
                    }
                    &.type-Score {
                        display: inline-block;
                        background: #222;
                        padding: 10px;
                    }
                    &.type-Array {
                        display: flex;
                        .array-items {
                            display: flex;
                            flex-wrap: wrap;
                            max-height: 35px;
                            &.expanded {
                                max-height: none;
                            }
                            overflow: hidden;
                            align-items: center;
                            .array-item {
                                text-transform: uppercase;
                                display: block;
                                background: #222;
                                border: 1px solid rgba(255,255,255, 0.1);
                                font-size: 14px;
                                border-radius: 5px;
                                padding: 4px 8px;
                                margin: 4px;
                            }
                        }
                        .expand-button {
                            cursor: pointer;
                            font-size: 10px;
                            border: 1px solid grey;
                            padding: 3px;
                        }
                    }
                }
            }
        }
    }
}
</style>