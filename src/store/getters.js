const getters = {
  getFileName: state => state.book.fileName,
  getMenuVisible: state => state.book.menuVisible,
  getSettingVisible: state => state.book.settingVisible,
  getDefaultFontSize: state => state.book.defaultFontSize,
  getDefaultFontFamily: state => state.book.defaultFontFamily,
  getFontFamilyVisible: state => state.book.fontFamilyVisible,
  getDefaultTheme: state => state.book.defaultTheme,
  getBookAvailable: state => state.book.bookAvailable,
  getProgress: state => state.book.progress,
  getSection: state => state.book.section,
  getIsPaginating: state => state.book.isPaginating,
  getCurrentBook: state => state.book.currentBook,
  getNavigation: state => state.book.navigation,
  getCover: state => state.book.cover,
  getMetadata: state => state.book.metadata,
  getPaginate: state => state.book.paginate,
  getPagelist: state => state.book.pagelist,
  getOffsetY: state => state.book.offsetY,
  getIsBookmark: state => state.book.isBookmark,
  getSpeakingIconBottom: state => state.book.speakingIconBottom,
  getHotSearchOffsetY: state => state.store.hotSearchOffsetY,
  getFlapCardVisible: state => state.store.flapCardVisible

}
export default getters
