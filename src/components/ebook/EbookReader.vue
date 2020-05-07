<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>
<script>
import Epub from 'epubjs'
import { ebookMixin } from '@/utils/mixins'

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
    // console.log('process.env', process.env.NODE_ENV)
  },
  methods: {

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

        if (time < 500 && offsetX > 40) { // 从左往右 上一页
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
        method: 'default'
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
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
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
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(location => {
        // console.log('location', location)

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
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
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

</style>
