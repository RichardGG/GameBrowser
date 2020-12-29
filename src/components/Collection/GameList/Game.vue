<template>
    <div class="game">
        <div class="visuals">
            <Cover :game="game" @click="mouseClick" :hoverEffect="false" :style="{width: `${100 * scale}px`}"></Cover>
            <div @click="toggleSelect" class="game-screenshot" :style="{width: `${250 * scale}px`,backgroundImage: `url(${primaryScreenshot})`}">
                <div class="screenshot-sizer"></div>
            </div>
        </div>
        <div class="info">
            <div class="selected">
                <span v-if="selected">✔</span>
                <span v-else>❌</span>
            </div>
            <div class="sort-info">
                {{ sortValue }}
            </div>
            <div class="end-item"></div>
        </div>
    </div>
</template>
<script>
import _ from 'lodash'
import Cover from './Cover.vue'
export default {
    name: 'Game',
    components: {
        Cover
    },
    props: {
        game: {
            type: Object,
            required: true
        },
        sort: {
            type: String
        },
        sortType: {
            type: String
        },
        scale: {
            type: Number,
            default: 1
        },
        selected: {
            type: Boolean,
        },
    },
    data() { 
        return {
            disableMouseUpdate: false,
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            size: ['B','KB','MB','GB','TB'],
            steamRatings: [
                'Overwhelmingly Negative',
                'Overwhelmingly Negative',
                'Overwhelmingly Negative',
                'Very Negative',
                'Negative',
                'Mostly Negative',
                'Mixed',
                'Mostly Positive',
                'Positive',
                'Very Positive',
                'Overwhelmingly Positive',
            ],
        }
    },
    computed: {
        primaryScreenshot() {
            return this.game.assets.steamScreenshots ? this.game.assets.steamScreenshots[0] : this.game.assets.gogScreenshots[0] ? this.game.assets.gogScreenshots[0].replace('{formatter}', '').replace('{ext}', 'webp') : ''
        },
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
        },
        sortValue() {
            const val = _.get(this.game, this.sort)
            if (this.sortType === 'Date') {
                const date = new Date(val * 1000)
                return date.getDate() + ' ' + this.months[date.getMonth()] + ' ' + date.getFullYear()
            } else if (this.sort === 'user.minutesInGame') {
                const hours = Math.floor(val / 60);
                const minutes = val % 60;
                return (hours ? `${hours}h ` : '') + `${minutes}m`
            } else if (this.sort === 'user.diskSize') {
                let num = val
                let count = 0
                while (num > 1024 && count < 4) {
                    num /= 1024
                    count++
                }
                return typeof num === 'number' ? num.toFixed(2) + ' ' + this.size[count] : 'NA'
            } else if (this.sort === 'reviews.steamPercent') {
                return val ? `${val}% Positive of ${_.get(this.game, 'reviews.steamTotal')}` : ''
            } else if (this.sort === 'reviews.steamValue') {
                return val ? `${this.steamRatings[val]} (${_.get(this.game, 'reviews.steamTotal')} Reviews)` : 'NA'
            } else if (this.sort === 'searchTitle' || this.sort === 'random') {
                return _.get(this.game, 'title', '')
            }
            return val
        }
    },
    methods: {
        transformGogScreenshot(url) {
            return url.replace('{formatter}', '').replace('{ext}', 'webp')
        },
        mouseClick() {
            this.$emit('gameClicked')
        },
        toggleSelect() {
            this.$emit('toggleSelect')
        },
    }
}
</script>
<style lang="scss">
@keyframes rotate3d {
    0% {
        transform: perspective(1000px) rotateX(8deg) rotateY(8deg) scale3d(1.1, 1.1, 1.1);
    }
    25% {
        transform: perspective(1000px) rotateX(8deg) rotateY(-8deg) scale3d(1.1, 1.1, 1.1);
    }
    50% {
        transform: perspective(1000px) rotateX(-8deg) rotateY(-8deg) scale3d(1.1, 1.1, 1.1);
    }
    75% {
        transform: perspective(1000px) rotateX(-8deg) rotateY(8deg) scale3d(1.1, 1.1, 1.1);
    }
    100% {
        transform: perspective(1000px) rotateX(8deg) rotateY(8deg) scale3d(1.1, 1.1, 1.1);
    }
}


.game {
    margin: 10px;
    background: #111;
    border-radius: 10px;
    .visuals {
        width: auto;
        display: flex;
        align-items: center;
        .game-screenshot {
            position: relative;
            background-size: cover;
            background-position: center;
            margin: 10px;
            margin-left: 0;
            border-radius: 5px;
            transition: transform .3s;
            .screenshot-sizer {
                padding-bottom: 100% * (9/16);
            }
            // &:hover {
            //     transform: scale(1.5);
            //     z-index: 10;
            // }
        }
    }
    .info {
        display: flex;
        align-items: center;
        padding-bottom: 5px;
        justify-content: space-between;
        .sort-info {
            // background: red;
            min-height: 20px;
            color: white;
            text-align: center;
            font-size: 14px;
        }
        .selected {
            margin-left: 10px;
            opacity: 0.3;
        }
        .end-item {
            width: 40px;
        }
    }
}
</style>