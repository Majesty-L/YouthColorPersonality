<template>
  <div class="container">
    <h2>色彩测试</h2>
    <span>每年两次的色彩心理健康测试可以及时的关注到每一位学生的变化。</span>
    <div class="new-test">
      <a-button @click="newTest">+ 新的测试</a-button>
      <div>推荐测试时间：2024年6月 <img src="@/assets/school/timer.png" alt="">设置提醒</div>
    </div>
    <div class="ing-test">
      <h3>进行中测试</h3>
      <div class="backup">
        <div v-if="!ingTestObject.id">没有正在进行中的测试，快开始新的测试吧！</div>
        <div v-else>
          <div class="">{{ ingTestObject.name }}</div>
          <a-divider></a-divider>
          <div class="">
            <span>知情同意情况</span>
            <a-slider class="slider" range :default-value="[0, 0]" :min="0" :max="100" disabled />
            <span>更新</span>
          </div>
        </div>
      </div>
    </div>
    <div class="history-test">
      <h3>历史测试</h3>
      <div class="backup">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
        ></a-table>
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
        {title:'发布时间', dataIndex: 'name'},
        {title:'结束时间', dataIndex: 'name'},
        {title:'知情同意情况', dataIndex: 'name'},
        {title:'测试完成度', dataIndex: 'name'},
      ],
      dataSource: [],
      schoolId: localStorage.getItem('school_id'),
    };
  },
  methods: {
    newTest() {
      if (this.ingTestObject.id) {
        this.$message.success('当前有测试进行中！');
        return;
      }
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const fileName = month < 6 ? `${year - 1}-1` : `${year}-2`;
      this.$axios.schoolNewTest({author: this.schoolId,name:fileName}).then(() => {
        this.$message.success('新建测试成功');
        this.$router.push({name: 'schoolNewTest'});
      })
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
  }
}
</style>