<template>
    <div class="header">
      <div class="logo" v-if="type===1" @click="back">
        <img src="@/assets/school/pageIcon.png" alt="avatar" />
        <span class="title ml">Little Mood</span>
      </div>
      <div class="back" v-else>
        <a-icon type="left" @click="back"></a-icon>
      </div>
      <div class="right">
        <share v-bind="$attrs"></share>
        <a-icon class="phone-menu" type="menu" @click="showDrawer=true" />
      </div>
      <a-drawer
        placement="right"
        :closable="false"
        :visible="showDrawer"
        width="13rem"
        @close="showDrawer=false"
      >
        <div class="flex-drawer" v-if="personId">
          <div @click="onClickReport('personHistoryReport')"><img class="mr" src="@/assets/person/phone-menu3.png" alt="">性格报告</div>
          <div @click="onClickReport('personCallback')"><img class="mr" src="@/assets/person/phone-menu4.png" alt="">评价反馈</div>
          <div @click="onClickReport('personCardInfo')"><img class="mr" src="@/assets/person/phone-menu5.png" alt="">账号信息</div>
          <div @click="deleteLocal"><img class="mr" src="@/assets/person/phone-menu6.png" alt="">退出登录</div>
        </div>
        <div class="flex-drawer" v-else>
          <div @click="login"><img class="mr" src="@/assets/person/phone-menu1.png" alt="">登录账号</div>
          <div @click="back"><img class="mr" src="@/assets/person/phone-menu2.png" alt="">购买测试</div>
        </div>
      </a-drawer>
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
        showDrawer: false,
      };
    },
    computed: {
      personId() {
        return this.$static.person_id || localStorage.getItem('person_id');
      }
    },
    created() {
    },
    methods: {
      back() {
        this.$router.push({name: 'personIndex'}).catch(() => {});
      },
      routerToReport() {
        this.$router.push({name: 'personReport'}).catch(() => {});
      },
      login() { 
        this.$router.push({name: 'personLogin'}).catch(() => {});
      },
      onClickReport(name) {
        this.$router.push({name}).catch(() => {});
      },
      deleteLocal() {
        this.$static.person_id = null;
        localStorage.removeItem('person_id');
        this.$router.push({name: 'personLogin'}).catch(() => {});
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
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.09);
    .logo, .back {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .title {
      color: #000;
      font-size: 1.2rem;
    }
    .right {
      display: flex;
      align-items: center;
      .phone-menu {
        font-size: x-large;
      }
    }
  }
  .flex-drawer {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    margin-top: 2rem;
  }
  </style>