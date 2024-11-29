
<template>
    <div class="right">
        <a-button class="share-btn" icon="share-alt"><span v-html="addPinyin('分享')"></span></a-button>
        <img class="pointer" src="@/assets/student/avator.png" alt="avatar"  @click="routerToReport"/>
    </div>
</template>
  
  <script>
  import { html } from 'pinyin-pro';
  export default {
    props: {
      type: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        addPinyin: html,
        personId: this.$static.person_id,
        personInfo: {},
      };
    },
    created() {
      // this.init();
    },
    methods: {
        show(row) {
            this.row = row;
            // console.log('show', row);
            this.shareUrl = `${window.location.origin}/color_web/view/${row.id}`;
            this.generateQRCode(this.shareUrl);
        },
        generateQRCode(url) {
            QRCode.toDataURL(url)
            .then(qrCodeUrl => {
                this.qrCodeUrl = qrCodeUrl;
            })
            .catch(error => {
                console.error('Failed to generate QR code:', error);
            });
        },
        // 分享功能 下载海报
        downloadPoster(posterName='poster') {
            // console.log(this.row)
            const posterElement = document.getElementById(posterName);
            const originalDevicePixelRatio = window.devicePixelRatio;
            // window.devicePixelRatio = 4;
            html2canvas(posterElement, { scale: window.devicePixelRatio }).then(canvas => {
            const posterImage = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = posterImage;
            link.download = `${this.row.name}分享海报.png`;
            link.click();
            window.devicePixelRatio = originalDevicePixelRatio;
            });
        },
    },
  }
  </script>
  
  <style lang="less" scoped>
  .header {
    height: 64px;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
    .logo, .back {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .title {
      color: #000;
      font-size: 24px;
    }
    .right {
      display: flex;
      align-items: center;
      .share-btn {
        border-radius: 12px;
        padding: auto 16px;
        margin-right: 16px;
      }
      .name-router {
        text-decoration: underline;
      }
      .name {
        font-weight: bold;
        text-align: end;
      }
      .pointer {
        cursor: pointer;
      }
    }
  }
  </style>