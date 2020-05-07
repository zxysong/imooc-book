<template>
  <div class="ebook">
    <EbookTitle></EbookTitle>
    <EbookReader></EbookReader>
    <EbookMenu></EbookMenu>
  </div>
</template>
<script>
import EbookReader from '@/components/ebook/EbookReader'
import EbookTitle from '@/components/ebook/EbookTitle'
import EbookMenu from '@/components/ebook/EbookMenu'
import { ebookMixin } from '@/utils/mixins'
import { getReadTime, saveReadTime } from '@/utils/localStorage'

export default {
  mixins: [ebookMixin],
  name: 'ebook',
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  mounted () {
    this.startLoopReadTime()
  },
  methods: {
    startLoopReadTime () {
      let readTime = getReadTime(this.getFileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.getFileName, readTime)
        }
      }, 1000)
    }
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global';
.ebook {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}
</style>
