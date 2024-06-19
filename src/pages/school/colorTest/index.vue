<template>
  <div class="container">
    <h2>色彩测试</h2>
    <span>每年两次的色彩心理健康测试可以及时的关注到每一位学生的变化。</span>
    <div class="new-test">
      <a-button @click="newTest">+ 新的测试</a-button>
      <div>推荐测试时间：{{ recommendTime }} <img src="@/assets/school/timer.png" alt="">设置提醒</div>
    </div>
    <div class="ing-test">
      <h3>进行中测试</h3>
      <div class="backup">
        <div v-if="!ingTestObject.id">没有正在进行中的测试，快开始新的测试吧！</div>
        <div v-else>
          <div class="">{{ ingTestObject.name }}</div>
          <a-divider></a-divider>
          <div class="process-view">
            <span>知情同意情况</span>
            <a-slider class="slider" v-model="processData" :min="0" :max="100" disabled />
            <span class="">{{processData}}%</span>
          </div>
          <div class="process-view">
            <span>测试进度统计</span>
            <a-slider class="slider" v-model="processData" :min="0" :max="100" disabled />
            <span class="">{{processData}}%</span>
          </div>
        </div>
        <div>
          <a-button v-if="ingTestObject.id" @click="refreshDetail">更新状态</a-button>
        </div>
      </div>
    </div>
    <div class="history-test">
      <h3>历史测试</h3>
      <div class="list">
        <a-table
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
        >
          <template slot="action">
            <a-button>查看报告</a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ingTestObject: {},
      columns: [
        {title:'测试', dataIndex: 'name'},
        {title:'发布时间', dataIndex: 'createTime'},
        {title:'结束时间', dataIndex: 'finishTime'},
        {title:'知情同意情况', dataIndex: 'knowPercent', customRender: (text) => (`${text*100}%`)},
        {title:'测试完成度', dataIndex: 'knowPercent1', customRender: (text) => (`${text*100}%`)},
        {title:'', scopedSlots: { customRender: 'action' }},
      ],
      dataSource: [],
      schoolId: localStorage.getItem('school_id'),
      fileName: '',
      recommendTime: '',
      processData: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      this.fileName = month < 6 ? `${year - 1}-1` : `${year}-2`;
      this.recommendTime = `${year}年${month < 6 ? 3 : 9}月`;
      this.$axios.schoolGetPapers({schoolId: this.schoolId}).then((res) => {
        if (res.length) {
          const paperList = res.sort((a,b)=>{
            let t1 = new Date(Date.parse(a.createTime.replace(/-/g,"/")));
            let t2 = new Date(Date.parse(b.createTime.replace(/-/g,"/")));
            return t2.getTime()-t1.getTime();
          });
          if (!paperList[0].finishTime) {
            this.ingTestObject = paperList[0];
            this.processData = this.ingTestObject.knowPercent ? Number((this.ingTestObject.knowPercent*100).toFixed(2)) : 0;
            this.dataSource = paperList.splice(1);
          } else {
            this.dataSource = paperList;
          }
        }
      });
    },
    newTest() {
      if (this.ingTestObject.id) {
        this.$message.success('当前有测试进行中！');
        return;
      }
      this.$axios.schoolNewTest({author: this.schoolId,name:this.fileName}).then((res) => {
        this.$message.success('新建测试成功');
        this.$router.push({name: 'schoolNewTest', params: {name:this.fileName, id: res}});
      })
    },
    refreshDetail() {
      this.$router.push({name: 'schoolNewTest', params: {name:this.ingTestObject.name, id: this.ingTestObject.id}});
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  margin: 36px;
  .backup {
    background-color: #fff;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36px;
    margin: 12px 0;
    .process-view {
      display: flex;
      align-items: center;
      .slider {
        width: 600px;
        margin: 0 12px;
      }
    }
  }
  .list {
    background-color: #fff;
    border-radius: 12px;
    padding: 36px;
    margin: 12px 0;
  }
}
</style>