<template>
<div class="intro-container">
  <headerPart :type="2"></headerPart>
  <div class="container">
    <div class="">
      <div class="title">
        <div class="speech" @click="play">
            <video class="video" id="play" width="120px" height="120px" v-if="showBtn" src="@/assets/speech/0.mp4">
            </video>
        </div>
        <span :class="showBtn?'':'pl'" v-html="addPinyin('Hi!')"></span>
        <span class="name" v-html="addPinyin(personInfo.name || '')"></span>
        <span v-html="addPinyin('小朋友')"></span>
        👋
      </div>
      <div class="text">
        <span v-html="addPinyin('让我们来玩个游戏，看看通过颜色能发现哪些关于你心情的秘密！')"></span><br/>
      </div>
      <div class="">
        <a-button class="btn-confirm" @click="startTest(type)"><span v-html="addPinyin('进入游戏')"></span></a-button>
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
      personInfo: {},
      addPinyin: html,
      type: this.$route.params.type,
      id: this.$route.params.id,
      showBtn: true,
    };
  },
  created() {
    if (!this.id) {
      this.$router.push({name: 'personIndex'});
    }
    this.getPersonInfo();
  },
  methods: {
    play() {
      var video = document.getElementById('play');
      video.play();
    },
    getPersonInfo() {
      this.$axios.personInfo({personId: this.personId}).then((res) => {
        if(res.length) {
          this.personInfo = res[0];
        }
      });
    },
    startTest(type=1) {
      this.$router.push({name: 'personTest', params: { type: type, id: this.id }});
    },
  },
}
</script>

<style lang="less" scoped>
@test-theme-color-person: #00D9C0;
.intro-container {
  .container {
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .speech {
        display: inline-block;
        background: no-repeat url('@/assets/person/laba.png');
        width: 120px;
        height: 120px;
        cursor: pointer;
        margin-left: -24px;
        .video {
            opacity: 0;
        }
    }
    .name {
      color: @test-theme-color-person;
      padding: 0 12px;
    }
    .title {
      display: flex;
      align-items: center;
      font-size: 60px;
    }
    .text {
      font-size: 36px;
      width: 600px;
      margin-bottom: 96px;
      line-height: 200%;
    }
  }
}
</style>