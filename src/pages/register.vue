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
        <a-input v-model="loginForm.password" type="password" placeholder="密码">
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="loginForm.key" placeholder="验证码">
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
          :disabled="!loginForm.username || !loginForm.key || !loginForm.password"
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
        password: '',
        key: '',
      }
    };
  },
  methods: {
    handleLogin() {
      if (this.loginForm.key === 'huangqian') {
        // console.log('登录信息:', this.loginForm);
        this.$axios.schoolRegister(this.loginForm).then((res) => {
          this.$confirm({
            title: '注册成功',
            content: '学校id为：'+res,
          });
        }).catch(() => {
          this.$message.error('注册失败');
        });
      } else {
        this.$message.error('验证码错误！');
      }
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
    margin-left: 48px;
  }
  .form {
    margin-right: 48px;
    flex: 1;
  }
}
</style>