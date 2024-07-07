<template>
  <div class="archive-container">
    <h2>年度报告</h2>
    <div>
      <a-breadcrumb>
        <a-breadcrumb-item><a @click="back">年度报告</a></a-breadcrumb-item>
        <a-breadcrumb-item v-if="paper_id">{{ paper_name }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="detail" v-if="!paper_id">
      <div class="class-item" v-for="item, index in paperList" :key="index" @click="onClickPaper(item)">
        <div :class="item.name.includes('（1）')?'history1 img-title':'history2 img-title'">
          {{ item.name.split('（')[0].split('测试')[1] }}
        </div>
        <span class="second-title">{{ item.name }}</span>
      </div>
    </div>
    <div class="report" v-else>
      <reportDetail :paperId="paper_id"></reportDetail>
    </div>
  </div>
</template>

<script>
import reportDetail from './reportDetail.vue';
export default {
  components: {
    reportDetail,
  },
  data() {
    return {
      schoolId: this.$static.school_id,
      paper_id: '',
      paper_name: '',
      paperList: [],
    };
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.init();
  },
  methods: {
    back() {
      this.paper_id = '';
    },
    init() {
      this.$axios.schoolGetPapers({schoolId: this.schoolId}).then((res) => {
        if (res.length) {
          this.paperList = res;
        }
      });
    },
    onClickPaper(paper) {
      const { id, name } = paper;
      this.paper_id = id;
      this.paper_name = name;
    },
  },
}
</script>

<style lang="less" scoped>
.archive-container {
  padding: 24px 48px;
  .detail {
    margin: 48px 0;
    display: flex;
    gap: 24px;
    flex-wrap: wrap;

    .class-item {
      cursor: pointer;

      .history1 {
        height: 160px;
        width: 240px;
        background: no-repeat url(@/assets/school/history1.png);
        background-size: cover;
      }
      .history2 {
        height: 160px;
        width: 240px;
        background: no-repeat url(@/assets/school/history2.png);
        background-size: cover;
      }
      .img-title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 12px;
        border-radius: 12px;
      }
      .second-title {
        font-size: 20px;
      }
    }
  }
}
</style>