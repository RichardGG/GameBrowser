import Vue from 'vue';
import App from './App.vue';
import VueLazyload from 'vue-lazyload'

import Unicon from 'vue-unicons'
import { uniSortAmountUp, uniSortAmountDown, uniArrowRandom, uniPen, uniCheck, uniTimes } from 'vue-unicons/src/icons'

Unicon.add([uniSortAmountUp, uniSortAmountDown, uniArrowRandom, uniPen, uniCheck, uniTimes])
Vue.use(Unicon)
Vue.use(VueLazyload)

new Vue({
  el: '#app',
  render: h => h(App)
})