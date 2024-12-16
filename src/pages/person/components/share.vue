<template>
  <div>
    <a-button class="share-btn" icon="share-alt" @click="showShare=true"><span v-html="addPinyin('分享')"></span></a-button>
    <a-modal :visible="showShare" title="分享给朋友" width="400px" :footer="null" @cancel="showShare=false">
      <div class="share-type">
        <a-button class="item" icon="link" @click="copyLink()">复制链接</a-button>
        <a-button class="item" icon="wechat" @click="shareWx()">分享到微信</a-button>
        <a-button class="item" icon="download" @click="downloadImg()">生成图片</a-button>
      </div>
      <div v-show="true" id="poster">
        <div v-if="animal" class="share1">
          <div class="logo">
            <img src="@/assets/school/pageIcon.png" alt="avatar" />
            <span class="title">Little Mood</span>
          </div>
          <h1 v-html="addPinyin('儿童色彩心理测试')"></h1>
          <img :src="this.qrCode" alt="">
        </div>
        <div v-else class="share2">
          <div class="logo">
            <img src="@/assets/school/pageIcon.png" alt="avatar" />
            <span class="title">Little Mood</span>
          </div>
          <img :src="this.qrCode" alt="">
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { html } from 'pinyin-pro';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
export default {
  props: {
    animal: {
      type: Number,
    },
  },
  data() {
    return {
      addPinyin: html,
      showShare: false,
      qrCodeUrl: '',
    };
  },
  created() {
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(window.location.href);
      this.$message.success('复制成功！');
    },
    shareWx() {
      const shareUrl = window.location.href;
      this.generateQRCode(shareUrl).then(() => {
        this.$confirm({
          title: '扫描二维码分享给朋友', 
          content: (<div><img src={this.qrCodeUrl} /></div>),
          okText: '确定',
          cancelText: '取消',
        })
      });
    },
    downloadImg() {
      this.downloadPoster();
    },
    generateQRCode(url) {
      return QRCode.toDataURL(url)
        .then(qrCodeUrl => {
          this.qrCodeUrl = qrCodeUrl;
        })
        .catch(error => {
          console.error('Failed to generate QR code:', error);
        });
    },
    // 分享功能 下载海报
    downloadPoster(posterName = 'poster') {
      const posterElement = document.getElementById(posterName);
      const originalDevicePixelRatio = window.devicePixelRatio;
      // window.devicePixelRatio = 4;
      html2canvas(posterElement, { scale: window.devicePixelRatio }).then(canvas => {
        const posterImage = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = posterImage;
        link.download = `分享海报.png`;
        link.click();
        window.devicePixelRatio = originalDevicePixelRatio;
      });
    },
  },
}
</script>

<style lang="less" scoped>
.share-btn {
  border-radius: 12px;
  padding: auto 16px;
  margin-right: 16px;
}
.share-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin: 24px;
  .item {
    width: 200px;
  }
}
.share1 {
  background: url('@/assets/person/share1.png') no-repeat center;
}
</style>