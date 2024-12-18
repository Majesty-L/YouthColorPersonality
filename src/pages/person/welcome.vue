<!-- 个人免登录欢迎页 -->
<template>
  <div class="intro-container">
    <headerPart :type="2" @getStudentInfo="getStudentInfo"></headerPart>
    <div class="container">
      <div class="header">
        <div class="intro">
          <div class="head-title" v-html="addPinyin('儿童色彩心理测试')"></div>
          <div class="head-txt">
            <p>您是否渴望拥有一把神奇的钥匙，轻轻一转，就能解锁孩子心灵深处那扇藏着无尽秘密与潜能的门扉，让他在学习的征途中更加自信，在与朋友的欢声笑语中更加自如，在与家人的温馨时刻里更加亲密，乃至在与所有人的交往中都能游刃有余，满载快乐与成功？</p>
            <p>每个孩子都是独一无二瑰宝，他们的性格特质不仅塑造了他们的独特魅力，更深刻地影响着他们的幸福感以及人际关系的和谐度。KH色彩性格测试，就如同一场专为孩子设计的奇妙探险之旅，它能帮助您和孩子一同揭开那层神秘的面纱，发现属于孩子的色彩密码——这密码中蕴含着孩子独特的学习模式、最有效的沟通方式，以及增进与家人朋友情感联结的秘诀。</p>
          </div>
        </div>
        <div class="action">
          <a-button class="btn" @click="consume">购买测试</a-button>
        </div>
      </div>
      <div class="main-container">
        <div class="partition">
          <div class="title">你的孩子是什么性格类型</div>
          <div class="none-item">
            <img src="@/assets/person/no-animal.png" alt="">
            <div class="txt2">动物形象</div>
          </div>
          <div class="animals">
            <div v-for="val, item of animalObjMap" :key="item" class="item">
              <img :src="animals[item]" alt="">
              <div class="txt">{{ animalObjMap[item] }}</div>
            </div>
          </div>
        </div>
        <div class="partition">
          <div class="title">本测试将帮助小朋友</div>
          <div class="help-detail">
            <!-- <div v-for="item in helpDetails" :key="item.bgColor" class="help-item" :style="{background: item.bgColor}">
              <img :src="item.img" alt="">
              <p>{{ item.txt }}</p>
            </div> -->
          </div>
        </div>
        <a-divider class="partition"></a-divider>
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
import * as animals from '@/assets/characterIcon';
import { animalObjMap } from './data.js';
import help1 from '@/assets/person/help1.png';
export default {
  components: {
    headerPart,
  },
  data() {
    return {
      studentInfo: {},
      addPinyin: html,
      type: this.$route.params.type,
      id: this.$route.params.id,
      animals,
      animalObjMap,
      helpDetails: [
        { img: help1, txt: '深入了解自己的性格特点，包括优点和可能的盲点', bgColor: '#00D9C0' },
        { img: help1, txt: '发现最适合自己的学习方式和节奏，提高学习效率', bgColor: '#FEE545' },
        { img: help1, txt: '洞察自己在人际关系中的角色，建立更健康、和谐的人际网络', bgColor: '#FE9845' },
        { img: help1, txt: '理解自己的沟通风格，学会更有效地与他人交流，减少误解', bgColor: '#FF7EEF' },
      ],
    };
  },
  created() {
  },
  methods: {
    getStudentInfo() {},
    consume() {
      // 生成预订单
      // 弹窗
      // 扫码支付回调
      // 一键登录
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .header {
    min-height: 1060px;
    background: url('@/assets/person/headerItems.png') no-repeat center 90% ,#F9F2CC;
    background-size: 70%;
    padding-top: 12rem;
    width: 100%;
    .intro {
      .head-title {
        font-size: 2.4rem;
        text-align: center;
      }
      .head-txt {
        margin: auto;
        max-width: 860px;
        margin-top: 3rem;
        line-height: 120%;
        padding: 20px;
      }
    }
    .action {
      margin-top: 3rem;
      text-align: center;
      .btn {
        background-color: #FA7800;
        color: #fff;
        width: 170px;
        border-radius: 16px;
      }
    }
  }
  .main-container {
    background-color: #fff;
    .partition {
      max-width: 860px;
      margin: 0 auto;
      .title {
        margin: 8rem 0 0;
        text-align: center;
        font-size: 2rem;
      }
      .none-item {
        display: block;
        margin: 1.5rem auto;
        width: 110px;
        height: 130px;
        text-align: center;
        border-radius: 0.5rem;
        box-shadow: 4px 4px 5px 2px rgba(0, 0, 0, 0.09);
        img {
          width: 70px;
        }
        .txt2 {
          font-size: 1.2rem;
          color: #757575;
          padding: 0.8rem 0;
        }
      }
      .animals {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 1rem;
        .item {
          flex: 0 1 130px;
          text-align: center;
          border-radius: 0.5rem;
          box-shadow: 4px 4px 5px 2px rgba(0, 0, 0, 0.09);
          img {
            width: 100px;
          }
          .txt {
            padding: 0.8rem 0;
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
@media (max-width: 860px) {
  .container {
    .header {
      min-height: 880px;
      background-size: 90%;
      padding-top: 66px;
      .intro {
        .head-title {
        }
        .head-txt {
          margin-top: 24px;
          line-height: 150%;
        }
      }
      .action {
        margin-top: 100px;
        .btn {
          
        }
      }
    }
    .main-container {
      .partition {
        .animals {
          gap: 0.5rem;
          padding: 0 20px;
          .item {
            flex: 0 1 90px;
            img {
              width: 77px;
            }
            .txt {
            }
          }
        }
      }
    }
  }
}
</style>