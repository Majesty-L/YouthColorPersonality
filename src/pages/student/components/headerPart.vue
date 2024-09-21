<template>
  <div class="header">
    <div class="logo" v-if="type===1">
      <img src="@/assets/school/pageIcon.png" alt="avatar" />
      <span class="title ml">Little Mood</span>
    </div>
    <div class="back" v-else>
      <a-icon type="left" @click="back"></a-icon>
    </div>
    <div class="right">
      <div class="mr">
        <div class="name pointer" @click="routerToReport">
          {{ studentInfo.name }}
        </div>
        <div class="name-router pointer" @click="deleteLocal">
          退出登录
        </div>
      </div>
      <img class="pointer" src="@/assets/student/avator.png" alt="avatar"  @click="routerToReport"/>
    </div>
    <slot>default</slot>
    <slot name="my" x="123">my</slot>
    <slot name="you" y="222">you</slot>
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
    routerToReport() {
      this.$router.push({name: 'studentReport'});
    },
    deleteLocal() {
      this.$static.student_id = null;
      localStorage.removeItem('student_id');
      this.$router.push({name: 'studentLogin'});
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 64px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
  .logo, .back {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .title {
    color: #B7B7BC;
    font-size: 24px;
  }
  .right {
    display: flex;
    align-items: center;
    .name-router {
      text-decoration: underline;
    }
    .name {
      font-weight: bold;
      text-align: end;
    }
    .pointer {
      cursor: pointer;
    }
  }
}
</style>