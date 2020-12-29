<template>
    <div class="cover" @mousemove="mouseMove" @mouseleave="mouseLeave" @click="mouseClick">
        <div class="cover-sizer"></div>
        <div v-if="!game.assets.portraitCover" v-bind:style="{'background-image': 'url(' + getScreenshot(game) + ')'}" class="screenshot"></div>
        <span class="title">{{ game.title }}</span>
        <img v-if="game.assets.portraitCover" v-lazy="game.assets.portraitCover" class="cover">
    </div>
</template>
<script>
export default {
    props: {
        game: {
            type: Object,
            required: true,
        },
        hoverEffect: {
            type: Boolean,
            default: true,
        }
    },
    methods: {
        getScreenshot(game) {
            return game.assets.steamScreenshots ? game.assets.steamScreenshots[0] : game.assets.gogScreenshots[0] ? game.assets.gogScreenshots[0].replace('{formatter}', '').replace('{ext}', 'webp') : ''
        },
        mouseMove(event) {
            if (this.disableMouseUpdate || !this.hoverEffect) {
                return
            }
            this.disableMouseUpdate = true
            setTimeout(() => {this.disableMouseUpdate = false}, 100)
            // return
            const target = this.$el
            const offset = target.getBoundingClientRect()
            const height = target.offsetHeight
            const width = target.offsetWidth
            const diffY = event.clientY - offset.top
            const diffX = event.clientX - offset.left
            const postop =  (diffY / height - 0.5) * -30
            const posleft = (diffX / width - 0.5) * 30
            target.style.transform = `perspective(1000px) rotateX(${postop}deg) rotateY(${posleft}deg) scale3d(1.2, 1.2, 1.2)`
        },
        mouseLeave(event) {
            this.$el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        },
        mouseClick(event) {
            this.$emit('click', event)
        }
    }
}
</script>
<style lang="scss">
.cover {
    position: relative;
    border: 2px;
    cursor: pointer;
    margin: 10px;
    padding: 0;
    font-size: 0;
    transform: none;
    transition: transform .2s;
    border: 0px solid #333;
    background: #333;
    overflow: hidden;
    flex-shrink: 0;
    border-radius: 6px;
    .cover-sizer {
        width: 100%;
        padding-bottom: 100% * (482 / 342);
    }
    .title {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        font-size: 22px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 10px;
        padding: 10px;
        overflow-wrap: break-word;
        word-break: break-word;
    }
    img {
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .screenshot {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        opacity: 0.7;
    }
    &:hover {
        z-index: 2;
    }
    
    .platform {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        right: 0;
        height: 20px;
        font-size: 10px;
        color: white;
        background: rgba(0,0,0,0.5);
        display: none;
    }
}
</style>