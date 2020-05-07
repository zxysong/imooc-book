<template>
  <transition name="slide-down">
   <div class="ebook-title title-wrapper" v-show="getMenuVisible">

    <div class="left">
      <span class="icon-back" @click="back"></span>
    </div>
    <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-cart"></span>
        </div>
        <div class="icon-wrapper" >
          <span class="icon-more"></span>
        </div>
    </div>
  </div>
    </transition>

</template>
<script>
import { ebookMixin } from '@/utils/mixins'
export default {
  mixins: [ ebookMixin ],
  methods: {
    back () {
      console.log('back')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global';
  .ebook-title.title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(48);
    display: flex;
    // background-color: #fff;
    box-shadow:  0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15) ;
     font-size: px2rem(22);
    .left {
      flex: 0 0 px2rem(37);
      // margin-left: px2rem(10);
      @include center;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        flex: 0 0 px2rem(37);
        @include center;
      }
    }
  }
</style>
