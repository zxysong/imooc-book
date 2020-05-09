<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="getMenuVisible && getSettingVisible === 3">
      <transition name="slide-right" v-if="getSettingVisible === 3 ">
        <div class="content">
          <div class="content-page-wrapper"  v-if="getBookAvailable" >
            <div class="content-page">
              <component :is="currentTab === 1 ? content : bookmark"  ></component>
            </div>
            <div class="content-page-tab">
              <div
                @click="selectTab(1)"
                :class="{'selected': currentTab === 1}"
                class="content-page-tab-item"
              >{{$t('book.navigation')}}</div>
              <div
                @click="selectTab(2)"
                :class="{'selected': currentTab === 2}"
                class="content-page-tab-item"
              >{{$t('book.bookmark')}}</div>
            </div>
          </div>
          <div  class="content-empty"  v-else>
              <EbookLoading></EbookLoading>
          </div>
        </div>
      </transition>

      <div class="cotent-bg" @click="hideTitleAndMenu()"></div>
    </div>
  </transition>
</template>
<script>
import { ebookMixin } from '@/utils/mixins'
import EbookSlideContent from './EbookSlideContent'
import EbookSlideMark from './EbookSlideMark'
import EbookLoading from './EbookLoading'
export default {
  mixins: [ebookMixin],
  data () {
    return {
      currentTab: 1,
      content: EbookSlideContent,
      bookmark: EbookSlideMark
    }
  },
  components: {
    EbookLoading
  },
  methods: {
    selectTab (currentTab) {
      this.currentTab = currentTab
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global";
.slide-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .content-page {
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
      .content-page-tab {
        flex: 0 0 px2rem(48);
        width: 100%;
        height: px2rem(48);
        display: flex;
        .content-page-tab-item {
          flex: 1;
          @include center;
          font-size: px2rem(12);
        }
      }
    }
    .content-empty {
      height: 100%;
      width: 100%;
      @include center;
    }
  }
  .cotent-bg {
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
  }
}
</style>
