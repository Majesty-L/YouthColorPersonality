<template>
<div class="intro-container">
  <headerPart :type="2" @getStudentInfo="getStudentInfo"></headerPart>
  <div class="container">
    <div class="">
      <div class="title">
        <span class="speech" v-if="showBtn" @click="speech">
          <img src="@/assets/student/laba.png" alt="">
        </span>
        <span :class="showBtn?'':'pl'" v-html="addPinyin('Hi!')"></span>
        <span class="name" v-html="addPinyin(studentInfo.name || 'xx')"></span>
        <span v-html="addPinyin('小朋友')"></span>
        👋
      </div>
      <div class="text">
        <span v-html="addPinyin('让我们一起来玩个游戏')"></span><br/>
        <span v-html="addPinyin('看看你的心情是什么颜色吧！')"></span>
      </div>
      <div class="pl">
        <a-button class="btn-student" @click="startTest(type)"><span v-html="addPinyin('进入游戏')"></span></a-button>
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
      studentInfo: {},
      addPinyin: html,
      type: this.$route.params.type,
      id: this.$route.params.id,
      showBtn: true,
    };
  },
  methods: {
    getStudentInfo(info) {
      this.studentInfo = info;
      if (info.type != '小学生') {
        this.addPinyin = (val) => val;
        this.showBtn = false;
      }
    },
    speech() {
      // 创建 SpeechSynthesisUtterance 对象
      const utterance = new SpeechSynthesisUtterance();
      // 设置要朗读的文本
      utterance.text = `Hi！${this.studentInfo.name}小朋友。让我们一起来玩个游戏，看看你的心情是什么颜色吧！`;
      // 朗读文本
      speechSynthesis.speak(utterance);
    },
    startTest(type=1) {
      this.$router.push({name: 'studentTest', params: { type: type, id: this.id }});
    },
  },
}
</script>

<style lang="less" scoped>
.intro-container {
  .container {
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .speech {
      cursor: pointer;
      margin-left: -24px;
    }
    .name {
      color:#63C5E9;
      padding: 0 12px;
    }
    .title {
      font-size: 60px;
    }
    .text {
      font-size: 36px;
      padding-left: 100px;
      // text-align: center;
      margin-bottom: 96px;
      line-height: 200%;
    }
    .pl {
      padding-left: 100px;
    }
  }
}
</style>