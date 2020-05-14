<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contens-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          class="slide-contents-search-input"
          :placeholder="$t('book.searchHint')"
          type="text"
          v-model="searchText"
          @click="showSearchPage()"
          @keyup.enter.exact="search()"
          ref="searchInput"
        />
        <div
          class="slide-contents-search-cancel"
          v-show="searchVisible"
          @click="hideSearchPage()"
        >{{$t('book.cancel')}}</div>
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="getCover" class="slide-contents-book-img" alt />
      </div>
      <div class="slide-contents-books-info-wrapper">
        <div class="slide-contents-books-title">{{getMetadata.title}}</div>
        <div class="slide-contents-books-author">{{getMetadata.creator}}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{getProgress+ '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText}}</div>
      </div>
    </div>
    <Scroll
      v-show="!searchVisible"
      class="slide-contents-list"
      :top="156"
      :bottom="48"
      ref="scroll"
    >
      <div class="slide-contents-item" v-for="(item, index) in getNavigation" :key="index">
        <div
          class="slide-contents-item-label"
          @click="displayNavigation(item.href)"
          :class="{'select': getSection === index} "
          :style="contentItemStyle(item)"
        >{{item.label}}</div>
        <div class="slide-contents-item-page">{{item.page}}</div>
      </div>
    </Scroll>
    <Scroll
      v-show="searchVisible"
      class="slide-search-list"
      :top="66"
      :bottom="48"
      ref="scrollSearch"
    >
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displayNavigation(item.cfi, true)"
      ></div>
    </Scroll>
  </div>
</template>
<script>
import { ebookMixin } from '@/utils/mixins'
import { px2rem } from '@/utils/utils'
import Scroll from '../Scroll'
export default {
  mixins: [ebookMixin],
  data () {
    return {
      searchVisible: false,
      searchList: [],
      searchText: ''
    }
  },
  components: {
    Scroll
  },
  methods: {
    displayNavigation (target, highLight = false) {
      this.display(target, () => {
        this.hideTitleAndMenu()
        if (highLight) {
          this.getCurrentBook.rendition.annotations.highlight(target)
        }
      })
    },
    displaySearch (target) {
      this.display(target, () => {
        this.hideTitleAndMenu()
      })
    },
    search () {
      if (this.searchText && this.searchText.length) {
        this.doSearch(this.searchText).then(result => {
          this.searchList = result.map(item => {
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            )
            return item
          })

          this.$refs.searchInput.blur()
        })
      }
    },
    showSearchPage () {
      this.searchVisible = true
    },
    hideSearchPage () {
      this.searchVisible = false
      this.searchText = ''
      this.searchList = []
    },
    contentItemStyle (item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    },
    doSearch (q) {
      return Promise.all(
        this.getCurrentBook.spine.spineItems.map(item =>
          item
            .load(this.getCurrentBook.load.bind(this.getCurrentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)))
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global";
.ebook-slide-contents {
  width: 100%;
  font-size: 0; // 消除空格
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contens-search-icon {
        float: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
        .icon-search {
        }
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-books-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-books-title {
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis2(2);
      }
      .slide-contents-books-author {
        margin-top: px2rem(5);
        font-size: px2rem(12);
        @include ellipsis2(2);
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        // line-height: px2rem(16);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      padding: px2rem(20) 0;
      box-sizing: border-box;
       display: flex;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        @include ellipsis;
        line-height: px2rem(16);
        &.select {
          color: green;
        }
      }
      .slide-contents-item-page {
          flex:  0 0  px2rem(30);
          font-size: px2rem(12);
          @include right;
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
