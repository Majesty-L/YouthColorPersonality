<template>
  <div class="login-container">
    <h1>登录页面</h1>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
       <label for="schoolName">学校名称:</label>
       <input type="text" id="schoolName" v-model="loginForm.schoolName" required>
      </div>
      <div class="input-group">
       <label for="username">账号:</label>
       <input type="text" id="username" v-model="loginForm.username" required>
      </div>
      <div class="input-group">
       <label for="password">密码:</label>
       <input type="password" id="password" v-model="loginForm.password" required>
      </div>
     <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
export default {
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

</style>