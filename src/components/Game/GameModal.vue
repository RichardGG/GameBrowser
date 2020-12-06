<template>
    <div>
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content">
            <button @click="launchGame">LAUNCH</button>
            <button @click="closeModal"><unicon name="times" fill="white" /></button>
            
            <div class="columns">
                <Slideshow :images="allImages"></Slideshow>
                <div class="game-info">
                    <div>
                        <strong>{{ game.title }}</strong>
                        <div v-for="(field, index) in displayedFields" :key="'field' + index">
                            <small>{{ field.title }}</small> <strong>{{ getInfo(field.path) }}</strong>
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
                    title: 'Developers',
                    path: 'info.developers',
                    type: 'Array',
                },
                {
                    title: 'Publishers',
                    path: 'info.publishers',
                    type: 'Array',
                },
                {
                    title: 'Release Date',
                    path: 'info.releaseDate',
                    type: 'Date',
                },
                {
                    title: 'Critic Score',
                    path: 'reviews.gogCriticsScore',
                    type: 'Score',
                },
                {
                    title: 'Critic Score',
                    path: 'reviews.steamPercent',
                    type: 'Score', 
                },
                {
                    title: 'Themes',
                    path: 'categories.themes',
                    type: 'Array',
                },
                {
                    title: 'Genres',
                    path: 'categories.genres',
                    type: 'Array',
                },
                {
                    title: 'Your Tags (GOG)',
                    path: 'categories.gogTags',
                    type: 'Array',
                },
                {
                    title: 'Steam User Tags',
                    path: 'categories.steamTags',
                    type: 'Array',
                },
                {
                    title: 'Features',
                    path: 'categories.steamFeatures',
                    type: 'Array',
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
                }                
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
    align-items: center;
    justify-content: center;
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
        width: 1200px;
        padding: 20px;
        overflow: scroll;
        background-color: #111;
        border-radius: 20px;
        overflow: hidden;
        .columns {
            display: flex;
        }
    }
    .game-info {
        color: white;
        padding: 20px;
    }
}
</style>