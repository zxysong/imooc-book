 <template>
  <div class="ebook" ref="ebookView">
    <EbookBookmark ></EbookBookmark>
    <EbookTitle></EbookTitle>
    <EbookHeader></EbookHeader>
    <EbookReader></EbookReader>
    <EbookMenu></EbookMenu>
    <EbookFooter></EbookFooter>
  </div>
</template>
<script>
import EbookBookmark from '@/components/ebook/EbookBookmark'
import EbookReader from '@/components/ebook/EbookReader'
import EbookTitle from '@/components/ebook/EbookTitle'
import EbookMenu from '@/components/ebook/EbookMenu'
import EbookHeader from '@/components/ebook/EbookHeader'
import EbookFooter from '@/components/ebook/EbookFooter'
import { ebookMixin } from '@/utils/mixins'
import { getReadTime, saveReadTime } from '@/utils/localStorage'

export default {
  mixins: [ebookMixin],
  name: 'ebook',
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  mounted () {
    this.startLoopReadTime()
  },
  watch: {
    getOffsetY (v) {
      // console.log('this.getMenuVisible', this.getMenuVisible, 'getBookAvailable', this.getBookAvailable)
      if (!this.getMenuVisible && this.getBookAvailable) {
        if (v === 0) {
          this.restore()
        } else if (v > 0) {
          this.move(v)
        }
      }
    }
  },
  methods: {
    move (offsetY) {
      this.$refs.ebookView.style.top = offsetY + 'px'
    },
    restore () {
      this.$refs.ebookView.style.top = 0
      this.$refs.ebookView.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebookView.style.transition = ''
      }, 200)
    },
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
