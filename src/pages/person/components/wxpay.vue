<template>
  <div class="report-detail">
    <a-modal :visible="visible" title="购买测试" width="800px" :footer="null" @cancel="onPayCancel">
      <div class="modal-content">
        <h2>扫码购买测试</h2>
        <div class="flex">
          <div class="left">
            <h3>购买须知</h3>
            <p>·本测评为付费测试，一次付费测试一次。</p>
            <p>·本测评为虚拟内容服务，一概售出概不退款，请谅解。</p>
          </div>
          <div class="right">
            <div>支付金额：<span>¥</span></div>
            <div class="wxpay-img"><img :src="prepayUrl" alt=""></div>
            <div><img src="@/assets/person/wxpay.png" alt="" width="20"> 微信支付</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import socketApi from '@/utils/socket.js';
const getStateByUrl = (url) => {
  let params = url?.split('&') || [];
  let state = params.find(i => i.includes('state'))?.split('=')[1] || 'test';
  return 'http://localhost:8090/websocket/'+state;
};
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    }
  },
  data() {
    return {
      prepayUrl: ''
    }
  },
  beforeDestroy(){
    socketApi.closeWebSocket();
  },
  watch: {
    visible(v) {
      if (v) {
        this.consume();
      }
    },
  },
  methods: {
    consume() {
      this.$axios.createOrder({type: 1}).then(res => {
        if (res) {
          console.log(res);
          this.generateQRCode(res);
          // 建立socket连接， 并设置socket信息返回接受函数和请求地址  
          socketApi.initWebSocket(this.getsocketResult, getStateByUrl(res));
        } else {
          this.$message.info('订单生成失败，请重试！');
        }
      }).catch(err => {
        console.error(err);
      });
    },
    // 生成微信登录二维码
    generateQRCode(url) {
      QRCode.toDataURL(url)
        .then(qrCodeUrl => {
          this.prepayUrl = qrCodeUrl;
        })
        .catch(error => {
          console.error('Failed to generate QR code:', error);
        });
    },
    // 
    getsocketResult(data) {
      console.log('接收到websocket信息：'+ data);
      if (data&&data.personId) {
        this.$message.success('支付成功！');
        localStorage.setItem('person_id', data.personId);
        this.$router.push({name: 'personIndex'});
      }
    },
    onPayCancel() {
      this.$emit('cancel');
    },
  },
}
</script>

<style lang="less" scoped>
.modal-content {
  h2 {
    text-align: center;
    margin-bottom: 24px;
  }
  .flex {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .right {
    text-align: center;
    .wxpay-img {
      margin: 12px;
      height: 200px;
      width: 200px;
    }
  }
}
</style>
  