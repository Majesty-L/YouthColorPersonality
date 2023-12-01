<template>
  <div>
    <div class="banner">
      <div class="banner-img">
        <img class="logo" src="@/assets/banner.png" alt="">
      </div>
    </div>
    <div class="login-container">
      <div class="group" v-show="showGroup">
        <h3 class="select_msg">请选择 色彩团队 / 其他 进入:</h3>
        <div class="group_card_container">
          <a-card hoverable class="group_card" @click="login('hnu')">
            <a-card-meta class="card_title" title="色彩团队">
            </a-card-meta>
          </a-card>
          <a-card hoverable class="group_card" @click="login('etc')">
            <a-card-meta class="card_title" title="其他">
            </a-card-meta>
          </a-card>
        </div>
      </div>
      <div class="login" v-show="!showGroup">
        <!-- <div class="back" @click="showGroup=true"><a-icon type="arrow-left" /> 返回上一步 </div> -->
        <a-card class="login-card">
          <template #title>
            <div @click="unlogin(group)">{{group==='hnu'?'色彩团队':''}}登录</div>
          </template>
          <a-form :form="form" @submit="handleLogin" @submit.native.prevent>
            <a-form-item label="用户名">
              <a-auto-complete :data-source="userOption" placeholder="请输入用户名" v-decorator="['username', { rules: [{ required: true, message: '请输入用户名！' }] }]" />
            </a-form-item>
            <a-form-item label="密码">
              <a-input-password placeholder="请输入密码" v-decorator="['password', { rules: [{ required: true, message: '请输入密码！' }] }]" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit" class="login-button">登录</a-button>
              <div class="tips">（没有该用户时将直接注册并登录）</div>
            </a-form-item>
          </a-form>
        </a-card>
      </div>
    </div>
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
      userOption: [],
      showGroup: true,
      group: '',
    };
  },
  mounted() {
    this.login('etc');
  },
  methods: {
    unlogin(group) {
      this.group = group==='hnu'?'etc':'hnu';
      this.showGroup = false;
      if (this.group === 'hnu') {
        this.$axios.getUsers({parent: this.group})
          .then(data => {
            // console.log(data);
            this.userOption = data;
          });
      } else {
        this.userOption = [];
      }
    },
    login(group) {
      this.group = group;
      this.showGroup = false;
      if (group === 'hnu') {
        this.$axios.getUsers({parent: group})
          .then(data => {
            // console.log(data);
            this.userOption = data;
          });
      } else {
        this.userOption = [];
      }
    },
    handleLogin() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const params = {
            ...values,
            parent: this.group,
          };
          this.$axios.getAuth(params)
            .then(data => {
              // console.log(data)
              localStorage.setItem('color_name', data.username);
              localStorage.setItem('color_parent', data.parent);
              this.$message.success('登录成功');
              this.$router.push({name: 'admin'});
            })
            .catch(error => {
              this.$message.error(error);
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 300px;
}

.login-button {
  width: 100%;
}
.tips {
  font-size: smaller;
  line-height: initial;
  text-align: center;
  color: #aba3a3;
}
.select_msg {
  text-align: center;
}
.group_card_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.group_card {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  margin: 12px 24px;
}
.group_card:hover {
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
}
.card_title >>> .ant-card-meta-title {
  font-size: x-large;
}
.back {
  color: #aba3a3;
  cursor: pointer;
}
</style>