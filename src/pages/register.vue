<template>
  <div class="login-container">
    <h1 class="left-container">学校注册页面</h1>
    <a-form-model class="form" :model="loginForm" @submit="handleLogin" @submit.native.prevent>
      <a-form-model-item>
        <a-input v-model="loginForm.username" placeholder="学校名称">
          <a-icon slot="prefix" type="bank" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="loginForm.shortname" placeholder="学校简称">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="loginForm.password" type="password" placeholder="密码">
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="!loginForm.username || !loginForm.shortname || !loginForm.password"
        >
          注册
        </a-button>
      </a-form-model-item>
    </a-form-model>
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
      this.$axios.schoolRegister(this.loginForm).then(() => {
        this.$message.success('注册成功');
      }).catch(() => {
        this.$message.error('注册失败');
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
  .left-container {
    flex: 1;
  }
  .form {
    flex: 1;
  }
}
</style>