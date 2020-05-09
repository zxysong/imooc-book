<template>
<div>
    <transition name="slide-up">
  <div class="ebook-menu menu-wrapper" :class="{'hide-box-shadow': getSettingVisible >= 0 || !getMenuVisible}" v-show="getMenuVisible">
    <div class="icon-wrapper">
      <span class="icon-menu"  @click="showSetting(3)"></span>
    </div>
    <div class="icon-wrapper">
      <span class="icon-progress"  @click="showSetting(2)"></span>
    </div>
    <div class="icon-wrapper">
      <span class="icon-bright"  @click="showSetting(1)"></span>
    </div>
    <div class="icon-wrapper">
      <span class="icon-A"  @click="showSetting(0)"></span>
    </div>
  </div>

      </transition>
      <ebook-setting-font></ebook-setting-font>
      <EbookSettingFontPopup></EbookSettingFontPopup>
      <EbookSettingTheme></EbookSettingTheme>
        <EbookSettingProgress></EbookSettingProgress>
        <EbookSlide />
</div>

</template>

<script>
import { ebookMixin } from '@/utils/mixins'
import EbookSettingFont from './EbookSettingFont'
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingProgress from './EbookSettingProgress'
import EbookSlide from './EbookSlide'
export default {
  mixins: [ebookMixin],
  data () {
    return {

    }
  },
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  mounted () {
    console.log('getSettingVisible 111', this.getSettingVisible)
  },
  methods: {
    showSetting (key) {
      this.setSettingVisible(key)
      console.log('getSettingVisible', this.getSettingVisible)
    }
  }

}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  height: px2rem(48);
  display: flex;
  background-color: #fff;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
   font-size: px2rem(22);
  &.hide-box-shadow {
      box-shadow: none;
    }
  .icon-wrapper {
    flex: 1;
     @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-A {
        font-size: px2rem(20);
      }
  }

}

</style>
