<template>
<div class="intro-container">
  <mobileHeader v-if="windowWidth<800"></mobileHeader>
  <headerPart :type="2"></headerPart>
  <div class="container">
    <div class="">
      <div class="title">
        <div class="speech" @click="play">
            <video class="video" id="play" width="7rem" height="7rem" v-if="showBtn" src="@/assets/speech/0.mp4">
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
      <div class="btn-container">
        <a-button class="btn-confirm" @click="startTest(type)"><span v-html="addPinyin('进入游戏')"></span></a-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import mobileHeader from './components/mobileHeader.vue';
import headerPart from './components/headerPart.vue';
import { html } from 'pinyin-pro';
export default {
  components: {
    mobileHeader,
    headerPart,
  },
  data() {
    return {
      personInfo: {},
      addPinyin: html,
      type: this.$route.params.type,
      id: this.$route.params.id,
      person_id: this.$static.person_id,
      showBtn: true,
      windowWidth: window.innerWidth,
    };
  },
  created() {
    if (!this.id) {
      this.$router.push({name: 'personIndex'});
    }
    if (this.person_id) {
      this.getPersonInfo();
    }
  },
  methods: {
    play() {
      var video = document.getElementById('play');
      video.play();
    },
    getPersonInfo() {
      this.$axios.personInfo({id: this.person_id}).then((res) => {
        if(res?.length) {
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
        background: no-repeat url('@/assets/person/laba.png') 0 0 /cover;
        width: 7rem;
        height: 7rem;
        cursor: pointer;
        margin-left: -1.5rem;
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
      font-size: 4rem;
      flex-wrap: wrap;
    }
    .text {
      font-size: 2.2rem;
      width: 38rem;
      margin-bottom: 8rem;
      line-height: 200%;
    }
  }
}
</style>
<style lang="less" scoped>
@media (max-width: 600px) {
.intro-container {
  .container {
    height: 90vh;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 4rem 0 4rem 1rem;
    .speech {
      width: 4rem;
      height: 4rem;
      margin-left: -1rem;
    }
    .name {
      padding: 0 0.8rem;
    }
    .title {
      font-size: 1.6rem;
    }
    .text {
      margin: 1rem 0 4rem;
      font-size: 1.2rem;
      width: 100%;
    }
    .btn-confirm {
      display: block;
      margin: 0 auto;
      width: 14rem;
      height: 4rem;
      font-size: 2rem;
    }
  }
}
}
</style>