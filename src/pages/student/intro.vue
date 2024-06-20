<template>
<div class="intro-container">
  <headerPart :type="2" @getStudentInfo="getStudentInfo"></headerPart>
  <div class="container">
    <div class="">
      <div class="title">
        <span class="speech" @click="sppech">朗读</span>
        <span v-html="addPinyin('Hi!')"></span>
        <span class="name" v-html="addPinyin(studentInfo.name || 'xx')"></span>
        <span v-html="addPinyin('小朋友')"></span>
        👋
      </div>
      <div class="text">
        <span v-html="addPinyin('让我们一起来玩个游戏')"></span><br/>
        <span v-html="addPinyin('看看你的心情是什么颜色吧！')"></span>
      </div>
      <a-button @click="startTest(type)"><span v-html="addPinyin('进入游戏')"></span></a-button>
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
    };
  },
  methods: {
    getStudentInfo(info) {
      this.studentInfo = info;
    },
    sppech() {
      // 创建 SpeechSynthesisUtterance 对象
      const utterance = new SpeechSynthesisUtterance();
      // 设置要朗读的文本
      utterance.text = `Hi！${this.studentInfo.name}小朋友。让我们一起来玩个游戏，看看你的心情是什么颜色吧！`;
      // 朗读文本
      speechSynthesis.speak(utterance);
    },
    startTest(type=1) {
      this.$router.push({name: 'studentTest', params: { type: type }});
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
      color:aquamarine;
    }
  }
}
</style>