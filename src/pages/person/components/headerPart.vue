<template>
  <div class="header">
    <div class="logo" v-if="type===1">
      <img src="@/assets/school/pageIcon.png" alt="avatar" />
      <span class="title ml">Little Mood</span>
    </div>
    <div class="back" v-else>
      <a-icon type="left" @click="back"></a-icon>
    </div>
    <div class="right">
      <share></share>
      <!-- <a-button class="share-btn" icon="share-alt"><span v-html="addPinyin('分享')"></span></a-button> -->
      <img v-if="personId" class="pointer" src="@/assets/student/avator.png" alt="avatar"  @click="routerToReport"/>
      <a-button v-else class="login-btn" v-html="addPinyin('登录测试')" @click="login"></a-button>
    </div>
  </div>
</template>

<script>
import { html } from 'pinyin-pro';
import share from './share.vue';
export default {
  components: {
    share,
  },
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      addPinyin: html,
      personInfo: {},
    };
  },
  computed: {
    personId() {
      return this.$static.person_id || localStorage.getItem('person_id');
    }
  },
  created() {
    // this.init();
  },
  methods: {
    // init () {
    //   this.$axios.personInfo({id: this.personId}).then((res) => {
    //     if(res.length) {
    //       this.personInfo = res[0];
    //       this.$emit('getPersonInfo', res[0]);
    //     }
    //   });
    // },
    back() {
      this.$router.push({name: 'personIndex'});
    },
    routerToReport() {
      this.$router.push({name: 'personReport'});
    },
    login() { 
      this.$router.push({name: 'personLogin'});
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
    font-size: 1.5rem;
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
    .login-btn {
      border-radius: 12px;
      padding: auto 16px;
      background-color: #00D9C0;
    }
  }
}
</style>