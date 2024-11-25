<!-- 个人免登录欢迎页 -->
<template>
  <div class="intro-container">
    <headerPart :type="2" @getStudentInfo="getStudentInfo"></headerPart>
    <div class="container">
      <div class="header">
        <div class="intro">
          <div class="head-title">
            儿童色彩心理测试
          </div>
          <div class="head-txt">
            <p>您是否渴望拥有一把神奇的钥匙，轻轻一转，就能解锁孩子心灵深处那扇藏着无尽秘密与潜能的门扉，让他在学习的征途中更加自信，在与朋友的欢声笑语中更加自如，在与家人的温馨时刻里更加亲密，乃至在与所有人的交往中都能游刃有余，满载快乐与成功？</p>
            <p>每个孩子都是独一无二瑰宝，他们的性格特质不仅塑造了他们的独特魅力，更深刻地影响着他们的幸福感以及人际关系的和谐度。KH色彩性格测试，就如同一场专为孩子设计的奇妙探险之旅，它能帮助您和孩子一同揭开那层神秘的面纱，发现属于孩子的色彩密码——这密码中蕴含着孩子独特的学习模式、最有效的沟通方式，以及增进与家人朋友情感联结的秘诀。</p>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="partition">
          <div class="title">你的孩子是什么性格类型</div>
          <div class="none-item"></div>
          <div class="animals">
            <div v-for="item in animals" :key="item.name" class="item">
              <img :src="animals[item.name]" alt="">
              <div class="">{{ item.intro }}</div>
            </div>
          </div>
        </div>
        <div class="partition">
          <div class="title">本测试将帮助小朋友</div>
          <div class="help-detail">
            <div v-for="item in helpDetails" :key="item.img" class="help-item" :style="{background: item.bgColor}">
              <img :src="`@/assets/person/${item.img}.png`" alt="">
              <p>{{ item.txt }}</p>
            </div>
          </div>
        </div>
        <a-divider></a-divider>
        <div class="detail">
          <div class="part">
            <img src="@/assets/person/i1.png" alt="">
            <div class="detail-title">测评理论</div>
            <p>本测评基于色彩心理学的综合测评体系，融合了多学科的理论与实践。这一体系扎根于日本和英国的色彩心理学研究，将色彩与个人心理特征紧密结合。同时为确保测试结果的科学性和精准性，本研究采用了SD统计学原理进行严格的色彩量化法。</p>
          </div>
          <div class="part">
            <img src="@/assets/person/i2.png" alt="">
            <div class="detail-title">测试报告涵盖内容</div>
            <div class="type">
              <div class="sub-title">· 类型分析 - 动物形象及色相色调等维度</div>
            </div>
            <div class="type">
              <div class="sub-title">· 色彩心理特征指数</div>
            </div>
            <div class="type">
              <div class="sub-title">· 各个方面的特质分析及建议</div>
            </div>
          </div>
          <a-divider></a-divider>
          <div class="part">
            <img src="@/assets/person/i3.png" alt="">
            <div class="detail-title">测试须知</div>
            <p>·本测评为付费测试，一次付费测试一次。</p>
            <p>·本测评为虚拟内容服务，一概售出概不退款，请谅解。</p>
            <p>·建议在网络条件较好的情况下进行测试，如果网络不好出现卡退等情况，重新进入点击测试则可以继续完成测试。</p>
            <p>·测评生成的报告可永久保留在个人主页，进入即可查看。</p>
            <p>·本测试结果更多的是对当下状态的反应，测试的结果也会随着时间变化，所以推荐定期的测试来了解自己的状态。</p>
          </div>
          <div class="attention">
            <div class="blind">
              因为我们通过颜色来分析测试，如果有红绿色盲、色弱等眼睛症状，会影响测试结果。不确定是否是这些症状，点击测试。
            </div>
            <div class="quick">快购买测试，和孩子一起探索色彩性格的秘密吧！</div>
            <a-button class="operation">购买测试</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
import { html } from 'pinyin-pro';
export default {
  components: {
    headerPart,
  },
  data() {
    return {
      animals: [],
      studentInfo: {},
      addPinyin: html,
      type: this.$route.params.type,
      id: this.$route.params.id,
      showBtn: true,
    };
  },
  created() {
    if (!this.id) {
      this.$router.push({name: 'studentIndex'});
    }
  },
  methods: {
  },
};
</script>

<style lang="less">
.container {
  .header {
    background-color: #F9F2CC;
    height: 1060px;
    .intro {
      // 往下移
      background: url('@/assets/person/headerItems.png');
    }
  }
  .main-container {
    background-color: #fff;
  }
}
</style>