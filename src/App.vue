<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
body {
  font-family: 'Source Han Sans CN', sans-serif !important;
  width: 100%; /* 默认情况下，body 宽度为 100% */
  max-width: 1008px; /* 但最大宽度为 1008px */
  margin: 0 auto !important; /* 居中对齐 */
}
@media screen and (min-width: 1280px) {
  body {
    max-width: 1280px; /* 当屏幕宽度至少为 1280px 时，最大宽度变为 1280px */
  }
}
/* 头部logo区域 */
.banner {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 114px;
  overflow: hidden;
  border-bottom: 2px solid #C9C9C9;
}
.banner-img {
  margin: 30px 16px;
}
.logo {
  height: 54px;
}
.point {
  cursor: pointer;
}
</style>
