<template>
  <div class="table-container">
    <a-table :columns="columns" :data-source="dataSource" rowKey="id" :scroll="{x: 800}" ></a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { title: '评分', dataIndex: 'grade', key: 'grade' },
        { title: '反馈', dataIndex: 'remark', key: 'remark' },
        { title: '时间', dataIndex: 'createTime', key: 'createTime' },
      ],
      gradeList: [
        { key: '一', title: '一年级' },
        { key: '二', title: '二年级' },
        { key: '三', title: '三年级' },
        { key: '四', title: '四年级' },
        { key: '五', title: '五年级' },
        { key: '六', title: '六年级' },
      ],
      dataSource: [],
    };
  },
  computed: {
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      this.$axios.getCallback().then((res) => {
        this.dataSource = res;
      });
    },
  },
}
</script>

<style lang="less" scoped>
.table-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 0 12px;
  width: 80%;

  /deep/.ant-table-body {
    background-color: #fff;

    .ant-table-thead th {
      background-color: #fff;
      color: #B7B7BC;
    }
  }
}
</style>