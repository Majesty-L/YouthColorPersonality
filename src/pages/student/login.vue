<template>
  <div class="login-container">
    <div class="img">
      <img src="@/assets/student/login.webp" alt="">
    </div>
    <div class="container">
      <div class="head">
        <div class="logo">
          <img src="@/assets/school/pageIcon.png" alt="avatar" />
          <span class="title">Little Mood</span>
        </div>
        <div class="title">学生端</div>
      </div>
      <a-form-model class="form" :model="loginForm" @submit.native.prevent>
        <a-form-model-item :colon="false">
          <template slot="label"><span class="label"><img src="@/assets/student/school.png" alt="">学校</span></template>
          <a-auto-complete v-model="loginForm.name" placeholder="输入学校名称" :data-source="schoolList" class="item">
          </a-auto-complete>
        </a-form-model-item>
        <a-form-model-item :colon="false">
          <template slot="label"><span class="label"><img src="@/assets/school/name.png" alt="">学号</span></template>
          <a-input v-model="loginForm.cardId" placeholder="输入学号或学籍号" class="item">
          </a-input>
        </a-form-model-item>
        <a-form-model-item :colon="false">
          <template slot="label"><span class="label"><img src="@/assets/school/password.png" alt="">密码</span></template>
          <a-input-password v-model="loginForm.password" placeholder="输入密码" class="item">
          </a-input-password>
        </a-form-model-item>
      </a-form-model>
      <a-button 
        class="btn-student"
        type="primary"
        :disabled="!loginForm.cardId || !loginForm.name || !loginForm.password"
        @click="handleLogin"
      >
        登录
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        cardId: '',
        name: '',
        password: '',
      },
      schoolList: ['长沙向阳小学'],
    };
  },
  methods: {
    handleLogin() {
      this.$axios.studentLogin(this.loginForm).then((res) => {
        this.$message.success('登陆成功');
        localStorage.setItem('student_id', res);
        this.$router.push({ name: 'studentIndex' });
      }).catch(() => {
        this.$message.error('帐号或密码错误');
      });
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  align-items: center;
  height: 100vh;
  .container {
    margin: 64px 96px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    flex: 1;
    height: 100%;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .logo {
      padding: 12px 28px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      margin-left: 6px;
      color: #5A5A61;
      font-size: 18px;
      font-weight: bold;
    }
    .form {
      .item {
        width: 400px;
      }
      /deep/ .ant-input, .ant-select-selection__rendered {
        border-radius: 30px;
        height: 52px;
        padding-left: 24px;
      }
      .label {
        font-size: 20px;
        color: #434349;
        line-height: 120%;
      }
    }
  }
}
</style>