<template>
  <div class="header">
    <div class="logo" v-if="type===1">
      <img src="@/assets/school/header.png" alt="avatar" />
      <span class="title">Little Mood</span>
    </div>
    <div class="" v-else>back</div>
    <div class="">{{ studentInfo.name }}</div>
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
      studentInfo: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init () {
      this.$axios.schoolStudentInfo({studentId: this.studentId}).then((res) => {
        if(res.length) {
          this.studentInfo = res[0];
          this.$emit('getStudentInfo', res[0]);
        }
      });
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
</style>