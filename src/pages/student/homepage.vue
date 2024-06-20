<template>
  <div class="home-container">
    <headerPart :type="1"></headerPart>
    <div class="ing-test">
      <a-row>
        <a-col class="test" :span="16">
          <div class="" @click="startTest">测试</div>
        </a-col>
        <a-col class="test" :span="8">色盲测试</a-col>
      </a-row>
    </div>
    <div class="history-test">
      <h3>历史测试</h3>
      <div class="list">
        <div class="item">
          <img src="@/assets/school/header.png" alt="avatar" />
          <span>xxx</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
export default {
  components: {
    headerPart,
  },
  data() {
    return {
      studentId: this.$static.student_id,
      studentInfo: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
    },
    startTest() {
      this.$router.push({name: 'studentIntro', params: { type: 1 }});      
    },
  }
}
</script>

<style lang="less" scoped>
.home-container {
  .ing-test {
    .test {
      display: flex;
      justify-content: flex-end;
      height: 420px;
      border: 1px solid #ddd;
    }
  }
  .history-test {
    .list {
      display: flex;
      gap: 24px;
      .item {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>