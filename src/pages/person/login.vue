<template>
  <div class="login-container">
    <div class="logo">
      <img src="@/assets/school/pageIcon.png" alt="avatar" />
      <span class="title">Little Mood</span>
    </div>
    <div class="container">
      <div class="login">

        <div v-if="activeMethod === 'wechat'" class="login-method">
          <h3 class="head"><img src="@/assets/person/wechat.png" alt="">微信扫码注册/登录</h3>
          <img class="qr-code" :src="qrCodeUrl" alt="QR Code">
          <a class="change-active" @click="activeMethod = 'sms'">手机号注册/登录</a>
        </div>
        
        <div v-else class="login-method">
          <h3 class="head">手机号注册/登录</h3>
          <a-form-item label="手机号">
            <a-input v-model="phoneCode" />
          </a-form-item>
          <a-form-item v-if="activeMethod === 'sms'" label="验证码">
            <a-input v-model="verificationCode" /><a @click="activeMethod = 'password'">密码登录</a>
          </a-form-item>
          <a-form-item v-if="activeMethod === 'password'" label="密码">
            <a-input type="password" v-model="password" /><a @click="activeMethod = 'sms'">验证码登录</a>
          </a-form-item>
          <a-button type="primary" @click="loginWithPhone">注册</a-button>
          <div class="change-active"><img src="@/assets/person/wechat.png" alt=""><a @click="activeMethod = 'wechat'">手机号注册/登录</a></div>
        </div>
      </div>
        
      <div class="img">
        <img src="@/assets/person/login.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
export default {
  data() {
    return {
      activeMethod: 'wechat', // 默认显示微信扫码登录
      phoneCode: '',
      verificationCode: '',
      phonePassword: '',
      password: ''
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.webGetUrl().then(res=>{
        console.log('webGetUrl', res);
        this.generateQRCode(res);
      })
    },
    // 生成微信登录二维码
    generateQRCode(url) {
      QRCode.toDataURL(url)
        .then(qrCodeUrl => {
          this.qrCodeUrl = qrCodeUrl;
        })
        .catch(error => {
          console.error('Failed to generate QR code:', error);
        });
    },
    loginWithPhone() {
      // 实现手机登录逻辑
      console.log('手机登录', this.phoneCode, this.verificationCode);
    },
  }
};
</script>

<style lang="less" scoped>
.login-container { 
  background-color: #FFF8D4;
  height: 100vh;
  padding: 54px 48px;
  .title {
    font-size: 24px;
    color: #000;
    margin-left: 24px;
  }
  .container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .head {
      text-align: center;
      margin-bottom: 24px;
      img {
        margin-right: 16px;
      }
    }
    .login {
      background-color: #fff;
      padding: 100px 160px;
      border-radius: 10px;
    }
    .change-active {
      margin-top: 24px;
      display: block;
      text-align: center;
    }
  }
}

</style>