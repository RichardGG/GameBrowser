<template>
    <div class="slideshow">
        <div class="main-image" :style="{backgroundImage: `url('${images[currentSlide].url}')`}"></div>
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
    }
}
</script>
<style lang="scss">
.slideshow {
    width: 600px;
    flex-shrink: 0;
    .main-image {
        width: 100%;
        padding-top: #{'min((9/16 * 100%), 50vh)'}; 
        max-height: 50vh;
        background-color: #333;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }
    .slides {
        display: flex;
        // overflow: scroll;
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