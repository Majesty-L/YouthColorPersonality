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
            <div id="wxqrcode-container" class="qr-code"></div>
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
                <a-button type="link" :loading="codeLoading" :disabled="codeLoading||hasSendCode" @click="getVerificationCode">
                  <span v-if="!hasSendCode">获取验证码</span>
                  <span v-else>{{ second }}s后重新发送</span>
                </a-button>
              </template>
            </a-input>
            <br/><a @click="activeMethod = 'password'">密码登录</a>
          </a-form-item>
          <a-form-item v-if="activeMethod === 'password'">
            <a-input type="password" v-model="password" placeholder="密码" /><br/><a @click="activeMethod = 'sms'">验证码登录</a>
          </a-form-item>
          <a-button class="register" block type="primary" @click="loginWithPhone">登录</a-button>
          <div class="change-active"><img src="@/assets/person/wechat.png" alt=""><a @click="activeMethod = 'wechat'">微信注册/登录</a></div>
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
// const getStateByUrl = (url) => {
//   let params = url.split('&');
//   let state = params.find(i => i.includes('state')).split('=')[1];
//   return process.env.VUE_APP_SOCKET_URL+state;
// };
export default {
  components: {
  },
  data() {
    return {
      activeMethod: 'sms', // 默认显示验证码
      phoneCode: '',
      verificationCode: '',
      phonePassword: '',
      password: '',
      qrCodeUrl: '',
      qrLoading: false,
      verificationCodeTimer: null,
      hasSendCode: false,
      codeLoading: false,
      second: 60,
      wxCode: '',
      redirect_uri: '/person/login',
    };
  },
  watch: {
    activeMethod: {
      handler(v) {
        if (v === 'wechat') {
          this.init();
        }
      },
      immediate: true,
    },
    $route: {
      handler: function(route) {
        this.wxCode = route.query.code||''
        //本地存储code是因为从其他页面返回vue页面存在缓存需要自定义刷新
        if(this.wxCode == localStorage["wxCode"]&&this.wxCode!=''){
          window.location.href=this.redirect_uri//回调地址
        }else{
          localStorage.setItem("wxCode",this.wxCode);
        }
        if(this.wxCode){
          let params = {
            code:this.wxCode,
            state:route.query.state,
          }
          this.$axios.getPersonId(params).then(res=>{
            if(res){
              this.$message.success('登陆成功');
              localStorage.setItem('person_id', res);
              this.$router.push({name: 'personIndex'});
            }
          }).catch(() => {
          //返回失败因为二维码已经被使用过所以需要刷新重新获取
            window.location.href=this.redirect_uri;
          });
        }
      },
      immediate: true
    }
  },
  created() {
    // this.init();
  },
  mounted(){
  },
  beforeDestroy(){
      socketApi.closeWebSocket();
      clearInterval(this.verificationCodeTimer);
  },
  methods: {
    init() {
      this.qrLoading = true;
      this.$axios.webGetUrl().then(res=>{
        console.log('webGetUrl', res);
        if (!res) {
          this.$message.error('获取二维码失败！');
          return;
        }
        this.qrCodeUrl = res;
        // this.generateQRCode(res);
        // 建立socket连接， 并设置socket信息返回接受函数和请求地址  
        // socketApi.initWebSocket(this.getsocketResult, getStateByUrl(res));
        this.getQrImg(res);
      }).finally(() => {
        this.qrLoading = false;
      })
    },
    getQrImg(res) {
      const data = res.split('?')[1].split('&');
      const APP_ID = data[0].split('=')[1];
      const STATE = data[2].split('=')[1];
      const origin = window.location.origin;
      new WxLogin({
        self_redirect: false, // 不改
        id: 'wxqrcode-container', // 二维码容器的id
        appid: APP_ID, // 网站应用的AppID
        scope: 'snsapi_login', // 不改
        redirect_uri: encodeURI(`${origin}/person/login`), // 重定向地址，通常是登录页地址（注意域名必须和网站应用的授权回调域名一致）
        state: STATE, // 重定向要带的参数，可以防止csrf攻击（加载二维码前从后端拿state值，扫码后再将state和code一起传回后端，后端验证state是否相同）
        style: 'white', // 文字颜色，只有黑白
        href: `data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIwMHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMDBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30g`, // 二维码的样式文件
      });
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
        if (!this.phoneCode.trim() || !this.password) {
          this.$message.warn('账号或密码不能为空！');
          return;
        }
        if (!(/^1\d{10}$/).test(this.phoneCode)) {
          this.$message.warn('手机号格式不对！');
          return;
        }
        this.$axios.validateLogin({phoneCode: this.phoneCode, password: this.password, mode:this.activeMethod}).then((res) => {
          this.$message.success('登陆成功');
          localStorage.setItem('person_id', res);
          this.$router.push({name: 'personIndex'});
        }).catch((err) => {
          this.$message.error(err);
        })
      } else if (this.activeMethod === 'sms') {
        if (!this.phoneCode.trim() || !this.verificationCode) {
          this.$message.warn('账号或验证码不能为空！');
          return;
        }
        if (!(/^1\d{10}$/).test(this.phoneCode)) {
          this.$message.warn('手机号格式不对！');
          return;
        }
        this.$axios.validateLogin({phoneCode: this.phoneCode, verificationCode: this.verificationCode, mode:this.activeMethod}).then((res) => {
          this.$message.success('登陆成功');
          localStorage.setItem('person_id', res);
          this.$router.push({name: 'personIndex'});
        }).catch((err) => {
          this.$message.error(err);
        })
      }
      console.log('手机登录', this.phoneCode, this.verificationCode);
    },
    getVerificationCode() {
      if (!this.phoneCode.trim()) {
        this.$message.warn('手机号不能为空！');
        return;
      }
      if (!(/^1\d{10}$/).test(this.phoneCode)) {
        this.$message.warn('手机号格式不对！');
        return;
      }
      this.codeLoading = true;
      this.$axios.getVerificationCode({phone: this.phoneCode}).then(() => {
        this.$message.success('发送成功！');
        this.startMinuteGap();
      }).catch(() => {
        this.$message.error('发送失败，请重试！');
      }).finally(() => {
        this.codeLoading = false;
      });
    },
    startMinuteGap() {
      this.hasSendCode = true;
      this.second = 60;
      this.verificationCodeTimer = setInterval(() => {
        if (this.second > 0 && this.second <= 60) {
          this.second--;
        } else {
          clearInterval(this.verificationCode);
        }
      }, 1000);
    },
  }
};
</script>

<style lang="less" scoped>
.login-container { 
  background-color: #FFF8D4;
  min-height: 100vh;
  padding: 4rem 1rem;
  text-align: center;
  .logo {
    text-align: left;
  }
  .title {
    font-size: 1.5rem;
    color: #000;
    margin-left: 1.5rem;
  }
  .container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    min-height: 80vh;
    .head {
      margin-bottom: 1.5rem;
      img {
        margin-right: 1rem;
      }
    }
    .spinning {
      width: 15rem;
      height: 15rem;
      /deep/.ant-spin-blur {
        opacity: 0;
      }
    }
    .qr-code {
      max-width: 100%;
      /deep/ iframe {
        width: 240px;
        height: 240px;
      }
    }
    .login {
      background-color: #fff;
      padding: 6rem 8rem;
      border-radius: 10px;
      margin: 0 1rem;
      .login-method {
        /deep/ .ant-form-item {
          text-align: left;
          border-radius: 24px;
          .ant-input {
            border-radius: 24px;
            height: 2.5rem;
            width: 22rem;
          }
        }
      }
    }
    .register {
      background-color: #00D9C0;
      border: none;
      border-radius: 16px;
      font-size: 1.2rem;
      color: #000;
      height: 3rem;
      margin-bottom: 2rem;
    }
    .change-active {
      margin-top: 1.5rem;
      display: block;
    }
    .img {
      img {
        max-width: 100%;
      }
    }
  }
}

</style>

<style lang="less" scoped>
@media (max-width: 1340px) {
  .login-container { 
    .container {
      .login {
        padding: 3rem 4rem;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@media (max-width: 768px) {
  .login-container { 
    .container {
      flex-wrap: wrap;
      .login {
        margin: 2rem 0;
        max-width: 100%;
      }
      .img {
        max-width: 80%;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@media (max-width: 425px) {
  .login-container { 
    .container {
      .login {
        .login-method {
          /deep/ .ant-form-item {
            .ant-input {
              width: 16rem;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@media (max-width: 400px) {
  .login-container { 
    .container {
      .login {
        padding: 2rem 1rem;
      }
    }
  }
}
</style>