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
      <a-form-model class="form" :model="loginForm" @submit="handleLogin" @submit.native.prevent>
        <a-form-model-item>
          <template slot="label"><a-icon type="bank" style="color:rgba(0,0,0,.25)" />账号</template>
          <a-input v-model="loginForm.username" placeholder="学校名称" class="item">
            <a-icon slot="prefix" type="bank" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="loginForm.shortname" placeholder="账号" class="item">
            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="loginForm.password" type="password" placeholder="密码" class="item">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="!loginForm.username || !loginForm.password"
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
        shortname: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      console.log('登录信息:', this.loginForm);
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
    margin: 48px;
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
    }
  }
}
</style>