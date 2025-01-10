<template>
  <div>
    <a-button v-if="windowWidth>800" class="share-btn" icon="share-alt" @click="showShare=true"><span v-html="addPinyin('分享')"></span></a-button>
    <a-icon v-else class="phone-share-btn" type="share-alt" @click="showShare=true"></a-icon>
    <a-modal :visible="showShare" title="分享给朋友" width="400px" :footer="null" @cancel="showShare=false">
      <div class="share-type">
        <a-button class="item" icon="link" @click="copyLink()">复制链接</a-button>
        <a-button class="item" icon="wechat" @click="shareWx()">分享到微信</a-button>
        <a-button class="item" icon="download" @click="downloadImg()">生成{{animal?'测试结果':''}}图片</a-button>
      </div>
    </a-modal>
    <div class="poster" id="poster">
      <div v-if="animal" class="share1">
        <div class="logo">
          <img src="@/assets/school/pageIcon.png" alt="avatar" />
          <span class="title">Little Mood</span>
        </div>
        <h2>{{ name || '我' }}的性格类型是</h2>
        <div class="mt">
          <div class="animal">
            <img :src="animals[animalType]" alt="">
            <h3 class="mb">{{ animalType }}</h3>
          </div>
        </div>
        <p class="desc">{{ describe }}</p>
        <p class="foot">你的孩子是什么性格类型？快扫码和孩子一起探索吧！</p>
        <div class="flex">
          <div class="left">
            <h3 v-html="addPinyin('儿童色彩性格测试')"></h3>
            <div class="time mt">
              <span class="mr">3道题</span>
              <span class="">5分钟</span>
            </div>
          </div>
          <div class="right">
            <img :src="this.qrCodeUrl" alt="" width="100px" height="100px">
          </div>
        </div>
      </div>
      <div v-else class="share2">
        <div class="logo">
          <img src="@/assets/school/pageIcon.png" alt="avatar" />
          <span class="title">Little Mood</span>
        </div>
        <h1 v-html="addPinyin('儿童色彩心理测试')"></h1>
        <p class="info">KH色彩性格测试是一场专为孩子设计的色彩性格奇妙探险之旅，它能帮助您和孩子一起探索他们的色彩密码——这密码中蕴含着孩子独特的学习模式、最有效的沟通方式，以及增进与家人朋友情感联结的秘诀。</p>
        <div class="mt mb"><img :src="this.qrCodeUrl" alt="" width="100px" height="100px"></div>
        <p class="foot">你的孩子是什么性格类型？<br/>快扫码和孩子一起探索吧！</p>
      </div>
    </div>
  </div>
</template>

<script>
import { html } from 'pinyin-pro';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { resultObject } from '../data.js';
import * as animals from '@/assets/characterIcon'
export default {
  props: {
    animal: {
      type: String,
    },
  },
  data() {
    return {
      addPinyin: html,
      showShare: false,
      qrCodeUrl: '',
      person_id: this.$static.person_id,
      name: '',
      describe: '',
      animalType: '',
      animals,
      windowWidth: window.innerWidth,
    };
  },
  created() {
  },
  watch: {
    animal: {
      handler(val) {
        console.log(val)
        this.getName(val);
      },
      immediate: true,
    },
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
      const shareUrl = window.location.href;
      this.generateQRCode(shareUrl).then(() => {
        this.downloadPoster();
      });
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
    getName(val) {
      if (!val) return;
      this.$axios.personInfo({id: this.person_id}).then((res) => {
        if(res?.length) {
          this.name = res[0]?.name || '';
          this.describe = resultObject[val]?.person_1 || '';
          this.animalType = resultObject[val]?.animal || '';
        }
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
.phone-share-btn {
  margin-right: 2rem;
  font-size: x-large;
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
.poster {
  position: fixed;
  left: -9999px;
  top: -9999px;
}
.share1, .share2 {
  text-align: center;
  width: 760px;
  padding-bottom: 12px;
  .logo {
    padding: 300px 0 36px;
    color: #000;
    .title {
      margin-left: 14px;
      font-size: 24px;
      font-weight: bold;
    }
  }
}
.share1 {
  background: url('@/assets/person/share1.png') no-repeat center center/cover;
  .logo {
    padding: 100px 0 48px;
  }
  .animal {
    display: inline-block;
    padding-top: 24px;
    border-radius: 24px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
    margin: 24px 0 48px;
    width: 200px;
    img {
      width: 200px;
      height: 200px;
      border-radius: 50%;
    }
  }
  .desc {
    display: inline-block;
    width: 50%;
    margin: auto 0;
    white-space: pre-wrap;
    text-align: justify;
  }
  .foot {
    margin: 48px 0;
  }
  .flex {
    display: inline-flex;
    width: 50%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 100px;
  }

}

.share2 {
  background: url('@/assets/person/share2.png') no-repeat center center/cover;
  .info {
    display: inline-block;
    width: 50%;
    margin: 36px 0;
    text-align: justify;
  }
  .foot {
    padding-bottom: 320px;
  }
}
</style>