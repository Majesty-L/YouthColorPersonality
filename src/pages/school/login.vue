<template>
  <div class="login-container">
    <h1 class="left-container">学校登录页面</h1>
    <a-form-model class="form" :model="loginForm" @submit="handleLogin" @submit.native.prevent>
      <a-form-model-item>
        <a-input v-model="loginForm.schoolName" placeholder="学校名称">
          <a-icon slot="prefix" type="bank" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="loginForm.username" placeholder="账号">
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
          :disabled="!loginForm.username || !loginForm.password"
        >
          登录
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
        schoolName: '',
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      // 在这里处理登录逻辑，例如验证输入和发送请求
      console.log('登录信息:', this.loginForm);
      // 假设有一个loginService来处理登录请求
      // this.loginService.login(this.loginForm);
    }
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