<template>
  <div class="ebook-reader">
    <div
      class="ebook-reader-mask"
      @mouseup.left="onMouseEnd"
      @mousemove.left="onMouseMove"
      @mousedown.left="onMouseEnter"
      @touchmove="move"
      @touchend="moveEnd"
      @click="onMaskClick"
    ></div>

    <div id="read"></div>
  </div>
</template>
<script>
import Epub from 'epubjs'
import { ebookMixin } from '@/utils/mixins'
import { flatten } from '@/utils/book'
import {
  getTheme,
  saveTheme,
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  // saveMetadata,
  getLocation
} from '@/utils/localStorage'
global.ePub = Epub
export default {
  name: 'ebookReader',
  mixins: [ebookMixin],
  data () {
    return {
      rendition: null
    }
  },
  mounted () {
    this.fileName = this.$route.params.fileName.split('|').join('/')

    this.setFileName(this.fileName).then(() => {
      this.initEpub()
    })

    // console.log(...[1, 2]) // 拆分
    // console.log('合并', [].concat(...[1, 2])) // 合并

    // console.log('process.env', process.env.NODE_ENV)

    // function flatten (arr) {
    //   return [].concat(...arr.map(item =>
    //     [].concat(...[item, ...flatten(item.subitems)])
    //   ))
    // }
    // console.log('flatten(nav)', flatten(nav))
  },
  methods: {
    // 1：鼠标移入
    // 2： 鼠标进入后的移动
    // 3: 鼠标从移动状态的还原
    // 4: 鼠标的还原
    onMouseEnter (e) {
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove (e) {
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.$store.commit('SET_OFFSETY', offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd (e) {
      if (this.mouseState === 2) {
        this.$store.dispatch('setOffsetY', 0)
        this.firstOffsetY = 0
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      this.mouseEndTime = e.timeStamp
      const time = this.mouseEndTime - this.mouseStartTime
      if (time < 100) { // 时间过短的误操作
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    move (e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        // this.$store.commit('SET_OFFSETY', offsetY)
        // console.log('offsetY', offsetY)
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd (e) {
      // this.$store.dispatch('setOffsetY', 0)
      this.setOffsetY(0)
      this.firstOffsetY = 0
    },
    onMaskClick (e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) return
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.showTitleAndMenu()
      }
    },

    parseBook () {
      this.book.loaded.cover.then(cover => {
        // console.log('cover', cover)
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
        // console.log('getMetadata', this.getMetadata)
      })

      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        // this.setMetadata(metadata)

        function find (item, level = 0) {
          return !item.parent
            ? level
            : find(
              navItem.filter(parentItem => parentItem.id === item.parent)[0],
              ++level
            )
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        // console.log('navigation', navItem)
        this.setNavigation(navItem)
      })
    },
    initGuest () {
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStsrtTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        this.touchEndX = event.changedTouches[0].clientX
        this.touchEndTime = event.timeStamp

        const offsetX = this.touchEndX - this.touchStartX
        const time = this.touchEndTime - this.touchStsrtTime

        if (time < 500 && offsetX > 40) {
          // 从左往右 上一页
          this.prevPage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.showTitleAndMenu()
        }
        event.preventDefault()
        event.stopPropagation()
      })
    },
    initRendition () {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default' // 微信端
      })

      const location = getLocation(this.getFileName)
      this.display(location, () => {
        this.initFontSize()
        this.initFontFamily()
        this.initTheme()
        this.initGlobalStyle()
      })
      // this.rendition.display().then(() => {
      //   this.initFontSize()
      //   this.initFontFamily()
      //   this.initTheme()
      //   this.initGlobalStyle()
      //   this.refreshLocation()
      // })
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          )
        ]).then(() => {})
      })
    },
    initTheme () {
      this.themeList.forEach(item => {
        this.rendition.themes.register(item.name, item.style)
      })
      let defaultTheme = getTheme(this.getFileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      } else {
        this.rendition.themes.select(defaultTheme) // this.getDefaultTheme
      }
      this.setDefaultTheme(defaultTheme)
    },
    initFontSize () {
      let fontSize = getFontSize(this.getFileName)
      if (!fontSize) {
        saveFontSize(this.getFileName, this.getDefaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initFontFamily () {
      let font = getFontFamily(this.getFileName)
      if (!font) {
        saveFontFamily(this.getFileName, this.getDefaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initEpub () {
      const baseUrl = 'http://192.168.31.63:8081/epub/'
      const url = baseUrl + this.fileName + '.epub'

      this.book = new Epub(url)

      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGuest()
      this.parseBook()
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          ) // 分页算法
        })
        .then(locations => {
          // console.log('location', location)
          locations.forEach(item => {
            
          })

          this.setBookAvailable(true)
          this.refreshLocation()
        })
    },

    prevPage () {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },

    showTitleAndMenu () {
      if (this.getMenuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.getMenuVisible)
      // console.log('showTitleAndMenu')
      // this.$store.dispatch('setMenuVisible', !this.getMenuVisible)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
