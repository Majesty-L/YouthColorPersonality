<template>
  <div class="header">
    <div class="logo" v-if="type===1" @click="back">
      <img src="@/assets/school/header.png" alt="avatar" />
      <span class="title">Little Mood</span>
    </div>
    <div class="back" v-else>
      <a-icon type="left" @click="back"></a-icon>
    </div>
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
      studentId: this.$static.student_id,
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
    back() {
      this.$router.push({name: 'studentIndex'});
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 64px;
  padding: 24px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
  .logo, .back {
    cursor: pointer;
  }
}
</style>