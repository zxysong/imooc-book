<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
document.addEventListener('DOMContentLoaded', () => {
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  const html = document.querySelector('html')
  html.style.fontSize = fontSize + 'px'
})
export default {

}
</script>
<style lang="scss" scoped>
  @import '@/assets/styles/global';
  #app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: $app-bgc;
  }
</style>
