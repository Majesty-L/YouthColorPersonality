<template>
  <div class="report-container">
    <mobileHeader v-if="windowWidth<800"></mobileHeader>
    <headerPart :type="2"></headerPart>
    <div class="content">
      <div class="self-info" v-if="windowWidth>800">
        <div class="menu">
          <div class="cursor" @click="curTab='personHistoryReport'"><img src="@/assets/person/menu1.png" alt="" class="mr">性格报告</div>
          <div class="cursor" @click="curTab='personCardInfo'"><img src="@/assets/person/menu2.png" alt="" class="mr">账号信息</div>
          <div class="cursor" @click="curTab='personCallback'"><img src="@/assets/person/menu3.png" alt="" class="mr">评价反馈</div>
        </div>
        <div class="remove" @click="deleteLocal">退出登录</div>
      </div>
      <router-view></router-view>
      <!-- <report-view v-if="curTab==='report'"></report-view>
      <card-info v-if="curTab==='info'"></card-info>
      <rate-info v-if="curTab==='callback'"></rate-info> -->
    </div>
  </div>
</template>

<script>
// import reportView from './reportView.vue';
// import cardInfo from './cardInfo.vue';
// import rateInfo from './rateInfo.vue';
import headerPart from '../components/headerPart.vue';
import mobileHeader from '../components/mobileHeader.vue';
export default {
  components: {
    mobileHeader,
    headerPart,
    // reportView,
    // cardInfo,
    // rateInfo,
  },
  props: {
  },
  data() {
    return {
      curTab: this.$route.name || 'report',
      windowWidth: window.innerWidth,
    };
  },
  watch: {
    curTab(v) {
      this.$router.push({name: v}).catch(()=>{});
    },
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
      margin-top: 3rem;
      .menu {
        line-height: 300%;
      }
      .remove {
        position: fixed;
        bottom: 3rem;
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
<style lang="less" scoped>
@media (max-width:800px) {
.content {
  justify-content: center;
}
}
</style>