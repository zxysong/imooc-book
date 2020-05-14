<template>
  <div>
    <div class="search-bar" :class="{'hide-title':!titleVisible, 'hide-shadow': !shadowVisible}  ">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="icon-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper">
            <span class="icon-shake icon" @click="showFlapCard"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title':!titleVisible}  ">
        <span class="icon-back icon" @click="back"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title' : !titleVisible}">
        <div class="search-blank" :class="{'hide-title' : !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input  type="text" class="input" v-model="searchText"  @click="showHotSearch"  :placeholder="$t('home.hint')" />
        </div>
      </div>
    </div>
    <HotSearchList v-show="hotSearchVisible" ref="hotSearch"></HotSearchList>
  </div>
</template>
<script>
import { storeHomeMixin } from '@/utils/mixins'
import HotSearchList from './HotSearchList'
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data () {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    getOffsetY (offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    getHotSearchOffsetY (offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    showFlapCard () {
      this.setFlapCardVisible(true)
    },
    back () {
      if (this.getOffsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      this.hideHotSearch()
    },
    hideHotSearch () {
      this.hotSearchVisible = false
      if (this.getOffsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    showHotSearch () {
      this.hideTitle()
      this.hideShadow()
      this.hotSearchVisible = true
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    hideTitle () {
      this.titleVisible = false
    },
    showTitle () {
      this.titleVisible = true
    },
    hideShadow () {
      this.shadowVisible = false
    },
    showShadow () {
      this.shadowVisible = true
    }
  }

}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global";
.search-bar {
  position: relative;
  z-index: 150;
  width: 100%;
  height: px2rem(94);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 105;
    width: 100%;
    height: px2rem(42);
    line-height: px2rem(42);

    .title-text-wrapper {
      position: absolute;
      width: 100%;
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      right: px2rem(15);
      @include center;
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    left: px2rem(15);
    line-height: px2rem(42);
    z-index: 200;
    @include center;
    transition: height 0.2s linear;
    &.hide-title {
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper {
    width: 100%;
    position: absolute;
    left: 0;
    top: px2rem(42);
    z-index: 155;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    transition: top 0.2s linear;
    display: flex;
    &.hide-title {
      top: 0;
    }
    .search-blank {
      flex: 0 0 0;
      width: 0;
      transition: all 0.2s linear;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      width: 100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      box-sizing: border-box;
      padding: px2rem(5) px2rem(15);
      border: px2rem(1) solid #eee;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        width: 100%;
        height: px2rem(20);
        border: none;
        font-size: px2rem(12);
        color: #666;
        margin-left: px2rem(10);
        background-color: transparent;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
    }
  }
}
</style>
