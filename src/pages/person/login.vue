<template>
  <div class="login-container">
    <div class="logo">
      <img src="@/assets/school/pageIcon.png" alt="avatar" />
      <span class="title">Little Mood</span>
    </div>
    <div class="container">
      <div class="login">

        <div v-if="activeMethod === 'wechat'" class="login-method">
          <h3 class="head">
            <img src="@/assets/person/wechat.png" alt="">
            微信扫码注册/登录
          </h3>
          <a-spin :spinning="qrLoading" class="spinning">
            <img class="qr-code" :src="qrCodeUrl" alt="QR Code">
          </a-spin>
          <a class="change-active" @click="activeMethod = 'sms'">手机号注册/登录</a>
        </div>
        
        <div v-else class="login-method">
          <h3 class="head">手机号注册/登录</h3>
          <a-form-item>
            <template #label><img src="@/assets/person/phone.png"/>手机号</template>
            <a-input v-model="phoneCode" placeholder="输入手机号" />
          </a-form-item>
          <a-form-item v-if="activeMethod === 'sms'">
            <a-input v-model="verificationCode" placeholder="短信验证码" >
              <template #suffix>
                <a @click="getVerificationCode">获取验证码</a>
              </template>
            </a-input>
            <br/><a @click="activeMethod = 'password'">密码登录</a>
          </a-form-item>
          <a-form-item v-if="activeMethod === 'password'">
            <a-input type="password" v-model="password" placeholder="密码" /><br/><a @click="activeMethod = 'sms'">验证码登录</a>
          </a-form-item>
          <a-button class="register" block type="primary" @click="loginWithPhone">登录</a-button>
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
import socketApi from '@/utils/socket.js';
const getStateByUrl = (url) => {
  let params = url.split('&');
  let state = params.find(i => i.includes('state')).split('=')[1];
  return 'http://localhost:8090/websocket/'+state;
};
export default {
  data() {
    return {
      activeMethod: 'wechat', // 默认显示微信扫码登录
      phoneCode: '',
      verificationCode: '',
      phonePassword: '',
      password: '',
      qrCodeUrl: '',
      qrLoading: false,
    };
  },
  created() {
    this.init();
  },
  mounted(){
  },
  beforeDestroy(){
      socketApi.closeWebSocket();
  },
  methods: {
    init() {
      this.qrLoading = true;
      this.$axios.webGetUrl().then(res=>{
        console.log('webGetUrl', res);
        this.generateQRCode(res);
        // 建立socket连接， 并设置socket信息返回接受函数和请求地址  
        socketApi.initWebSocket(this.getsocketResult, getStateByUrl(res));
      }).finally(() => {
        this.qrLoading = false;
      })
    },
    getsocketResult(data) {
      console.log('接收到websocket信息：'+ data);
      if (data) {
        this.$message.success('登陆成功');
        localStorage.setItem('person_id', data);
        this.$router.push({name: 'personIndex'});
      }
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
      if (this.activeMethod === 'password') {
        if (this.password && this.phoneCode) {
          this.$axios.validateLogin({phoneCode: this.phoneCode, password: this.password}).then((res) => {
            this.$message.success('登陆成功');
            localStorage.setItem('person_id', res);
            this.$router.push({name: 'personIndex'});
          }).catch((err) => {
            this.$message.error(err);
          })
        }
      }
      console.log('手机登录', this.phoneCode, this.verificationCode);
    },
    getVerificationCode() {
      // 实现获取验证码逻辑
    },
  }
};
</script>

<style lang="less" scoped>
.login-container { 
  background-color: #FFF8D4;
  height: 100vh;
  padding: 54px 48px;
  text-align: center;
  .logo {
    text-align: left;
  }
  .title {
    font-size: 24px;
    color: #000;
    margin-left: 24px;
  }
  .container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 80vh;
    .head {
      margin-bottom: 24px;
      img {
        margin-right: 16px;
      }
    }
    .spinning {
      width: 240px;
      height: 240px;
      /deep/.ant-spin-blur {
        opacity: 0;
      }
    }
    .qr-code {
    }
    .login {
      background-color: #fff;
      padding: 100px 120px;
      border-radius: 10px;
      .login-method {
        /deep/ .ant-form-item {
          text-align: left;
          border-radius: 24px;
          .ant-input {
            border-radius: 24px;
            height: 40px;
            width: 360px;
          }
        }
      }
    }
    .register {
      background-color: #00D9C0;
      border: none;
      border-radius: 16px;
      font-size: 18px;
      color: #000;
      height: 48px;
      margin-bottom: 36px;
    }
    .change-active {
      margin-top: 24px;
      display: block;
    }
  }
}

</style>