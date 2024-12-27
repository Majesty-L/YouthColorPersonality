<template>
  <div class="report-container">
    <headerPart :type="2"></headerPart>
    <div class="content">
      <div class="self-info" v-if="windowWidth>800">
        <div class="menu">
          <div class="cursor" @click="curTab='report'"><img src="@/assets/person/menu1.png" alt="" class="mr">性格报告</div>
          <div class="cursor" @click="curTab='info'"><img src="@/assets/person/menu2.png" alt="" class="mr">账号信息</div>
          <div class="cursor" @click="curTab='callback'"><img src="@/assets/person/menu3.png" alt="" class="mr">评价反馈</div>
        </div>
        <div class="remove" @click="deleteLocal">退出登录</div>
      </div>
      <report-view v-if="curTab==='report'"></report-view>
      <card-info v-if="curTab==='info'"></card-info>
      <rate-info v-if="curTab==='callback'"></rate-info>
    </div>
  </div>
</template>

<script>
import reportView from './reportView.vue';
import cardInfo from './cardInfo.vue';
import rateInfo from './rateInfo.vue';
import headerPart from '../components/headerPart.vue';
export default {
  components: {
    headerPart,
    reportView,
    cardInfo,
    rateInfo,
  },
  data() {
    return {
      curTab: 'report',
      windowWidth: window.innerWidth,
    };
  },
  created() {
  },
  methods: {
    deleteLocal() {
      this.$static.person_id = null;
      localStorage.removeItem('person_id');
      this.$router.push({name: 'personLogin'});
    },
  }
}
</script>

<style lang="less" scoped>
@test-theme-color-person: #00D9C0;
.report-container {
  .content {
    margin-top: 24px;
    display: flex;
    .self-info {
      flex: 0 0 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 48px;
      .menu {
        line-height: 300%;
      }
      .remove {
        position: fixed;
        bottom: 48px;
        cursor: pointer;
        border-radius: 12px;
        padding: 2px 12px;
        background-color: #B7B7BC;
        color: #fff;
      }
    }
  }
}
</style>