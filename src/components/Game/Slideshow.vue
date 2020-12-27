<template>
    <div class="slideshow">
        <div class="main-image">
            <div class="background-image" :style="{backgroundImage: `url('${images[currentSlide].url}')`}"></div>
            <div class="contained-image" :style="{backgroundImage: `url('${images[currentSlide].url}')`}"></div>
        </div>
        <div class="slides">
            <div @click="currentSlide = index" v-for="(image, index) in images" :key="'slide' + index" :style="{backgroundImage: `url('${image.url}')`}"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        images: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            currentSlide: 0
        }
    },
    mounted() {
        this.cycle()
    },
    methods: {
        cycle() {
            console.log('cycle')
            this.index = this.index + 2 < this.images.length ?  this.index + 1 : 0
            this.currentSlide = this.index
            setTimeout(this.cycle, 8000)
        }
    }
}
</script>
<style lang="scss">
.slideshow {
    width: 100%;
    flex-shrink: 0;
    .main-image {
        width: 100%;
        padding-top: #{'min((9/16 * 100%), 60vh)'}; 
        max-height: 60vh;
        position: relative;
        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: cover;
            background-position: center;
            opacity: 0.3;
            filter: blur(10px);
        }
        .contained-image {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
        }
    }
    .slides {
        display: flex;
        width: 100%;
        max-height: 10vw;
        overflow: scroll;
        flex-wrap: wrap;
        div {
            width: 20%;
            padding-top: 9/16 * 20%;
            background-color: #333;
            display: inline-block;
            flex-shrink: 0;
            margin-right: 0px;
            background-size: cover;
            background-position: center;
        }
    }
}
</style>