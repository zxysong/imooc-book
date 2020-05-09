<template>
  <transition name="fade">
    <div class="setting-wrapper" v-show="getMenuVisible && getSettingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <!-- {{getReadTime()}} -->
          <span class="read-time-text">{{getReadTimeText}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <span class="icon-back" @click="prevSection()"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @input="onProgressInput($event.target.value)"
                 @change="onProgressChange($event.target.value)"
                 :value="getProgress"
                 :disabled="!getBookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span class="progress-text">({{getBookAvailable ? getProgress + '%' : $t('book.loading')}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import { ebookMixin } from '@/utils/mixins'
import { saveProgress } from '@/utils/localStorage'

export default {
  mixins: [ebookMixin],
  data () {
    return {
      isProgressLoading: false
    }
  },
  computed: {

  },
  mounted () {
    // console.log('progress', this.getProgress)
  },
  methods: {

    prevSection () {
      //  !this.isProgressLoading  ==  getBookAvailable
      if (this.getSection > 0 && this.getBookAvailable) {
        this.isProgressLoading = true
        // console.log('888')
        this.setSection(this.getSection - 1).then(() => {
          this.displaySection()
          this.isProgressLoading = false
          // this.displaySection(() => {
          //   this.updateProgressBg()
          //
          // })
        })
      }
    },
    nextSection () {
      // console.log('nextSection')、
      if (this.getCurrentBook.spine.length - 1 > this.getSection && this.getBookAvailable) {
        this.isProgressLoading = true
        this.setSection(this.getSection + 1).then(() => {
          this.displaySection()
          this.isProgressLoading = false
          // this.displaySection(() => {
          //   this.updateProgressBg()
          //
          // })
        })
      }
    },
    displaySection () {
      const sectionInfo = this.getCurrentBook.section(this.getSection)
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
        // this.getCurrentBook.rendition.display(sectionInfo.href).then(() => {
        //   this.refreshLocation()
        // })
      }
    },

    onProgressInput (progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
      })
    },
    onProgressChange (progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
        this.displayProgress()
      })
      saveProgress(this.getFileName, progress)
    },
    displayProgress () {
      const cfi = this.getCurrentBook.locations.cfiFromPercentage(this.getProgress / 100)

      // this.getCurrentBook.rendition.display(cfi).then(() => {
      //   this.refreshLocation()
      // })
      this.display(cfi)
    },
    updateProgressBg () {
      this.$refs.progress.style.backgroundSize = `${this.getProgress}% 100% `
    }
  },
  updated () {
    this.updateProgressBg()
    // this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "@/assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 190;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        @include center;
        font-size: px2rem(12);
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress {
          flex: 1;
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          background: -webkit-linear-gradient(#5d6268, #5d6268) no-repeat, #b4b5b7;
          background-size: 0 100%;
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #ceced0;
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .15);
            border: none;
          }
        }
        .progress-icon-wrapper {
          flex: 0 0 px2rem(22);
          font-size: px2rem(22);
          @include center;
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(5);
        width: 100%;
        font-size: px2rem(12);
        text-align: center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          line-height: px2rem(15);
          @include ellipsis;
        }
        .progress-text {
        }
      }
    }
  }
</style>
