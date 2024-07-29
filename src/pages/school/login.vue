<template>
  <div class="login-container">
    <div class="img">
      <img src="@/assets/school/login.png" alt="">
    </div>
    <div class="container">
      <div class="head">
        <div class="logo">
          <img src="@/assets/school/pageIcon.png" alt="avatar" />
          <span class="title">Little Mood</span>
        </div>
        <div class="title">学校端</div>
      </div>
      <a-form-model class="form" :model="loginForm" @submit.native.prevent>
        <a-form-model-item :colon="false">
          <template slot="label"><span class="label"><img src="@/assets/school/name.png" alt="">账号</span></template>
          <a-input v-model="loginForm.username" placeholder="输入账号" class="item">
          </a-input>
        </a-form-model-item>
        <a-form-model-item :colon="false">
          <template slot="label"><span class="label"><img src="@/assets/school/password.png" alt="">密码</span></template>
          <a-input-password v-model="loginForm.password" placeholder="输入密码" class="item">
          </a-input-password>
        </a-form-model-item>
      </a-form-model>
      <a-button
        class="btn-school"
        type="primary"
        :disabled="!loginForm.username || !loginForm.password"
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
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      // console.log('登录信息:', this.loginForm);
      this.$axios.schoolLogin(this.loginForm).then((data) => {
        this.$message.success('登陆成功');
        localStorage.setItem('school_id', data);
        this.$router.push({name: 'schoolIndex'});
      }).catch(() => {
        this.$message.error('登陆失败');
      });
    },
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
      /deep/ .ant-input {
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