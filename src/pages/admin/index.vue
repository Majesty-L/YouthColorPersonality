<template>
  <div class="report-container">
    <a-form-model-item v-if="easyPassword !== 'huangqian'">
      <a-input v-model="easyPassword" placeholder="验证码">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <div class="content" v-else>
      <div class="self-info">
        <div class="menu">
          <div class="cursor" @click="curTab = 'report'"><img src="@/assets/person/menu1.png" alt="" class="mr">学校报告</div>
          <div class="cursor" @click="curTab = 'info'"><img src="@/assets/person/menu2.png" alt="" class="mr">学校注册</div>
          <div class="cursor" @click="curTab = 'callback'"><img src="@/assets/person/menu3.png" alt="" class="mr">评价反馈
          </div>
        </div>
      </div>
      <overview v-if="curTab === 'report'"></overview>
      <register v-if="curTab === 'info'"></register>
      <callback v-if="curTab === 'callback'"></callback>
    </div>
  </div>
</template>

<script>
import overview from './overview.vue';
import register from './register.vue';
import callback from './callback.vue';
export default {
  components: {
    overview,
    register,
    callback,
  },
  data() {
    return {
      easyPassword: 'huangqian',
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
      this.$router.push({ name: 'personLogin' });
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
      flex: 0 0 200px;
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