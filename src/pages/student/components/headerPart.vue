<template>
  <div class="header">
    <div class="logo" v-if="type===1">
      <img src="@/assets/school/header.png" alt="avatar" />
      <span class="title">Little Mood</span>
    </div>
    <div class="" v-else>back</div>
    <div class="">xx</div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
    };
  },
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
</style>