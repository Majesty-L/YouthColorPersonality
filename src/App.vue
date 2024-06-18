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
  background-color: #F8F8FA;
  font-family: 'Source Han Sans CN', sans-serif !important;
  width: 100%; /* 默认情况下，body 宽度为 100% */
  margin: 0 auto !important; /* 居中对齐 */
}
</style>
