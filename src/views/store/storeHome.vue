<template>
  <div class="book-home">
    <searchBar></searchBar>
    <Scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
      <div>5555555555555</div>
    </Scroll>
    <FlapCard :data="random"></FlapCard>
  </div>
</template>
<script>
import searchBar from '@/components/home/searchBar'
import Scroll from '@/components/Scroll'
import FlapCard from '@/components/home/flapCard'
import { storeHomeMixin } from '@/utils/mixins'
// console.log('storeHomeMixin', storeHomeMixin, ebookMixin)
import { home } from '@/api/store'
export default {
  mixins: [ storeHomeMixin ],
  components: {
    searchBar,
    Scroll,
    FlapCard
  },
  data () {
    return {
      scrollTop: 94,
      random: null
    }
  },
  mounted () {
    home().then((res) => {
      if (res && res.status === 200) {
        const data = res.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
      }
    })
  },
  methods: {
    onScroll (offsetY) {
      // console.log(offsetY)
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh()
      // console.log('getOffsetY', this.getOffsetY)
    }
  },
  watch: {
    getOffsetY (offsetY) {

    }
  }

}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global";
.book-home {
  // position: relative;
  // z-index: 100;
  width: 100%;
  height: 100%;
  // background: white;
  // overflow: hidden;
}
</style>
