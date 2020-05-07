import { mapActions, mapGetters } from 'vuex'
import { themeList } from '@/utils/book'
import { addCss, removeAllCss } from '@/utils/utils'
import { saveLocation } from '@/utils/localStorage'
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'getFileName',
      'getMenuVisible',
      'getSettingVisible',
      'getDefaultFontSize',
      'getDefaultFontFamily',
      'getFontFamilyVisible',
      'getDefaultTheme',
      'getBookAvailable',
      'getProgress',
      'getSection',
      'getIsPaginating',
      'getCurrentBook',
      'getNavigation',
      'getCover',
      'getMetadata',
      'getPaginate',
      'getPagelist',
      'getOffsetY',
      'getIsBookmark',
      'getSpeakingIconBottom'
    ]),
    themeList () {
      return themeList(this)
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setSpeakingIconBottom'
    ]),
    initGlobalStyle () {
      removeAllCss()
      switch (this.getDefaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Glod':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation () {
      const currentLocation = this.getCurrentBook.rendition.currentLocation()
      const startCfi = currentLocation.start.cfi
      const progess = this.getCurrentBook.locations.percentageFromCfi(currentLocation.start.cfi)

      this.setProgress(Math.floor(progess * 100))
      this.setSection(currentLocation.start.index)
      saveLocation(this.getFileName, startCfi)
    },
    display (target, cb) {
      if (target) {
        this.getCurrentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.getCurrentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    }
  }
}
