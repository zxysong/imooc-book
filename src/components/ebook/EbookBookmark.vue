<template>
  <div class="ebook-bookmark" ref="ebookBookmark">
   <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">
        {{text}}
      </div>
    </div>

    <div class="ebook-bookmark-icon-wrapper"  :style="isFixed ? fixedStyle : {}" >
      <book-mark :width="15" :height="35" :color="color" ref="bookmark"></book-mark>
    </div>
  </div>
</template>
<script>
import { realPx } from '@/utils/utils'
import { ebookMixin } from '../../utils/mixins'
import { saveBookmark, getBookmark } from '../../utils/localStorage'
import BookMark from './Bookmark'

const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  mixins: [ebookMixin],
  components: {
    BookMark
  },
  data () {
    return {
      color: '',
      text: '',
      setBookmark: false,
      isFixed: false
    }
  },
  computed: {
    height () {
      return realPx(35)
    },
    threshold () {
      return realPx(55)
    },
    fixedStyle () {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.ebookBookmark.clientWidth) / 2}px`

      }
    }
  },
  watch: {
    getOffsetY (v) {
      // console.log('111', e)
      if (this.getMenuVisible || !this.getBookAvailable || this.getSettingVisible >= 0) return

      if (v >= this.height && v < this.threshold) {
        // console.log('第二个阶段  未到达临界状态')
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        // console.log('第三阶段 超越临界状态')
        this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        // console.log('第一阶段 默认值 未超过书签高度')
        this.beforeHeight()
      } else if (v === 0) {
        // console.log('第0阶段 归位 ')
        this.restore()
      }
    },
    getIsBookmark (IsBookmark) {
      this.isFixed = IsBookmark
      // && !this.getMenuVisible && this.getSettingVisible === -1
      if (IsBookmark) {
        this.color = BLUE
        // console.log('getIsBookmark', IsBookmark)
      } else {
        this.color = WHITE
      }
    }
  },
  methods: {
    addBookMark () {
      this.bookmark = getBookmark(this.getFileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.getCurrentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)/, '')
      const cfiRange = `${cfibase}!,${cfistart},${cfiend})`
      const cfi = currentLocation.start.cfi
      this.getCurrentBook.getRange(cfiRange).then(range => {
        let text = range.toString()
        text = text.replace(/\s\s/g, '')
        text = text.replace(/\r/g, '')
        text = text.replace(/\n/g, '')
        text = text.replace(/\t/g, '')
        text = text.replace(/\f/g, '')
        // console.log('text', text)
        this.bookmark.push({
          cfi: cfi,
          text: text
        })
        this.setIsBookmark(true)
        saveBookmark(this.getFileName, this.bookmark)
      })
    },
    removeBookMark () {
      const currentLocation = this.getCurrentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.getFileName)
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
        saveBookmark(this.getFileName, this.bookmark)
      }
      this.setIsBookmark(false)
    },
    restore () {
      setTimeout(() => {
        this.$refs.ebookBookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookMark()
      } else {
        this.setIsBookmark(false)
        this.removeBookMark()
      }
    },
    beforeHeight () {
      if (this.getIsBookMark) {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    },
    beforeThreshold (v) {
      this.$refs.ebookBookmark.style.top = `${-v}px`
      this.beforeHeight()
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
      this.isFixed = false
    },
    afterThreshold (v) {
      this.$refs.ebookBookmark.style.top = `${-v}px`

      if (this.getIsBookMark) {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }

      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-bookmark {
  position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
     .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
     }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(10);
    }
}
</style>
