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
            <div>支付金额：<span>¥ {{ price }}</span></div>
            <a-spin :spinning="loading" class="spinning">
              <div class="wxpay-img"><img :src="prepayUrl" alt=""></div>
            </a-spin>
            <div class="mb"><img src="@/assets/person/wxpay.png" alt="" width="20"> 微信支付</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import socketApi from '@/utils/socket.js';
const getStateByUrl = (url='test') => {
  return process.env.VUE_APP_SOCKET_URL+url;
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
      prepayUrl: '',
      personId: this.$static.person_id || localStorage.getItem('person_id'),
      price: '',
      loading: false,
    }
  },
  beforeDestroy(){
    socketApi.closeWebSocket();
  },
  watch: {
    visible(v) {
      if (v) {
        if (!this.personId) {
          this.$message.info('请先登录！');
          this.$router.push('/person/login');
          return;
        }
        this.loading = true;
        this.consume();
      }
    },
  },
  methods: {
    consume() {
      this.$axios.createOrder({type: 1, personId: this.personId}).then(res => {
        if (res?.payUrlCode) {
          this.generateQRCode(res.payUrlCode);
          this.price = res.price;
          // 建立socket连接， 并设置socket信息返回接受函数和请求地址  
          socketApi.initWebSocket(this.getsocketResult, getStateByUrl(res.orderId));
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
          this.loading = false;
        })
        .catch(error => {
          console.error('Failed to generate QR code:', error);
        });
    },
    // 接受回调后重新进入页面
    getsocketResult(data) {
      console.log('接收到websocket信息：'+ data);
      if (data) {
        this.$message.success('支付成功！');
        this.$emit('success', data);
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
      margin: 12px 12px 0;
      height: 150px;
      width: 150px;
    }
  }
}
</style>
  