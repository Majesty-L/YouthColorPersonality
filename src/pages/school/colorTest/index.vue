<template>
  <div class="container">
    <h2>色彩测试</h2>
    <span class="subtitle">每年两次的色彩心理健康测试可以及时的关注到每一位学生的变化。</span>
    <div class="new-test">
      <a-button class="btn-school else" :disabled="!!ingTestObject.id" @click="newTest">+ 新的测试</a-button>
      <div>推荐测试时间：{{ recommendTime }} <img class="clock" src="@/assets/school/timer.png" alt="">设置提醒</div>
    </div>
    <div class="ing-test">
      <h3>进行中测试</h3>
      <div class="backup">
        <div v-if="!ingTestObject.id">没有正在进行中的测试，快开始新的测试吧！</div>
        <div v-else>
          <div class="ing-title">{{ ingTestObject.name }}</div>
          <a-divider></a-divider>
          <div class="process-view">
            <span>知情同意情况</span>
            <a-slider class="slider" v-model="processData" :min="0" :max="100" disabled />
            <span class="num">{{processData}}</span>
            <span class="">%</span>
          </div>
          <div class="process-view">
            <span>测试进度统计</span>
            <a-slider class="slider" v-model="finishData" :min="0" :max="100" disabled />
            <span class="num">{{finishData}}</span>
            <span class="">%</span>
          </div>
        </div>
        <div>
          <a-button class="btn-school" v-if="ingTestObject.id" @click="refreshDetail">查看测试状态</a-button>
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
          <template slot="action" slot-scope="text, row">
            <a-button class="btn" @click="onClickAction(row)">查看报告</a-button>
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
        {title:'测试完成度', dataIndex: 'knowPercent1', customRender: (text) => (`${text*100}%`), width: 400},
        {title:'', scopedSlots: { customRender: 'action' } },
      ],
      dataSource: [],
      schoolId: localStorage.getItem('school_id'),
      fileName: '',
      recommendTime: '',
      processData: 0,
      finishData: 0,
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
      this.fileName = month < 6 ? `测试${year}（1）` : `测试${year}（2）`;
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
            this.finishData = Number((this.ingTestObject.finishNum*100/this.ingTestObject.studentNum).toFixed(2));
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
    onClickAction({id, name}) {
      this.$router.push({path: '/school/report', query: { paper: id, paper_name: name }});
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 24px 48px;
  h2 {
    font-size: 36px;
    margin-bottom: 6px;
  }
  .subtitle {
    font-size: 16px;
    color: #70708F;
  }
  .else {
    border-radius: 12px;
    margin: 24px 0 12px;
  }
  .clock {
    margin: 0 2px 0 48px;
    width: 16px;
  }
  h3 {
    font-size: 20px;
  }
  .ing-test {
    margin-top: 48px;
    .ing-title {
      font-size: 48px;
      font-weight: bold;
      color: #6C72C9;
    }
    /deep/ .ant-slider-disabled .ant-slider-handle {
      border-color: #6C72C9 !important;
      background-color: #6C72C9;
    }
    /deep/ .ant-slider-track {
      background-color: #6C72C9 !important;
    }
  }
  .history-test {
    margin-top: 24px;
    .btn {
      background-color: #6C72C9;
      width: 100px;
      height: 36px;
      border-radius: 18px;
      color: #fff;
      font-size: 14px;
    }
    /deep/.ant-table-body {
      background-color: #fff;

      .ant-table-thead th {
        background-color: #fff;
        color: #B7B7BC;
      }
    }
  }
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
      span {
        color: #B5B6C9;
      }
      .slider {
        width: 600px;
        margin: 0 12px;
      }
      .num {
        color: #16161D;
        font-weight: bold;
        font-size: 20px;
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