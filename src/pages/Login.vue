<template>
  <div class="login-container">
    <a-row type="flex" justify="center" align="middle" class="login-row">
      <a-col :span="8">
        <a-card title="登录" class="login-card">
          <a-form :form="form" @submit="handleLogin" @submit.native.prevent>
            <a-form-item label="用户名">
              <a-input placeholder="请输入用户名" v-decorator="['username', { rules: [{ required: true, message: '请输入用户名！' }] }]" />
            </a-form-item>
            <a-form-item label="密码">
              <a-input-password placeholder="请输入密码" v-decorator="['password', { rules: [{ required: true, message: '请输入密码！' }] }]" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit" class="login-button">登录</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>

export default {
  name: 'AdminLogin',
  components: {
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: 'login_form' }),
    };
  },
  mounted() {
  },
  methods: {
    handleLogin() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios.getAuth(values)
            .then(response => {
              console.log('response',response)
              const {code,data} = response.data;
              if (code === 20041) {
                localStorage.setItem('colorAuth', data);
                this.$message.success('登录成功');
                this.$router.push({name: 'admin'});
              } else {
                throw new Error('用户名或密码错误！');
              }
            })
            .catch(error => {
              console.log(error)
              this.$message.error(error.message);
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-row {
  height: 100%;
}

.login-card {
  width: 300px;
}

.login-button {
  width: 100%;
}
</style>