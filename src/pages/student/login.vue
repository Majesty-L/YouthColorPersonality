<template>
  <div class="login-container">
    <h1 class="left-container">学生登录页面</h1>
    <a-form-model class="form" :model="loginForm" @submit="handleLogin" @submit.native.prevent>
      <a-form-model-item>
        <a-select v-model="loginForm.name" placeholder="学校" :options="schoolList">
          <!-- <a-icon slot="suffixIcon" type="school" style="color:rgba(0,0,0,.25)" /> -->
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-input v-model="loginForm.cardId" placeholder="账号">
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
          :disabled="!loginForm.cardId || !loginForm.name || !loginForm.password"
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
        cardId: '',
        // name: '',
        password: '',
      },
      schoolList: [{key:'长沙向阳小学',title:'长沙向阳小学'}],
    };
  },
  methods: {
    handleLogin() {
      this.$axios.studentLogin(this.loginForm).then((res) => {
        this.$message.success('登陆成功');
        localStorage.setItem('student_id', res);
        this.$router.push({name: 'studentIndex'});
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
  .left-container {
    flex: 1;
  }
  .form {
    flex: 1;
  }
}
</style>