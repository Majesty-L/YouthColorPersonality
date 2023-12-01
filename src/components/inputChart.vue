<template>
  <div class="container">
    <a-table :rowKey="(record,index) => index" :columns="tableCol" :data-source="chartData" :pagination="false" :scroll="{ y: 300 }"></a-table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default {
  name: 'InputResultAnalyse',
  props: {
    row: Object,
    index: Number,
    selectedData: {
      type: Array,
      default: ()=>[],
    },
  },
  data() {
    return {
      chartData: [],
      tableCol: [{title:'内容',dataIndex:'code'}],
    }
  },
  // watch: {
  //   selectedData: {
  //     handler() {
  //       this.initChart();
  //     },
  //   },
  // },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      this.chartData = this.selectedData;
      // 向上传递下载参数
      this.downloadPart();
    },
    download(type) {
      const dataMap = {
        phase: this.phaseTable,
        hue: this.hueTable,
        stripe: this.stripeTable,
      };
      const colMap = {
        phase: this.phaseTableCol,
        hue: this.hueTableCol,
        stripe: this.stripeTableCol,
      };
      const tableData = dataMap[type];
      const tableColumns = colMap[type];
      const data = tableData.map(row => {
        const rowData = {};
        tableColumns.forEach(column => {
          rowData[column.title] = row[column.dataIndex];
        });
        return rowData;
      });
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, `${type}.xlsx`);
    },
    downloadPart() {
      const tableData = this.chartData;
      const tableColumns = this.tableCol;
      const data = tableData.map(row => {
        const rowData = {};
        tableColumns.forEach(column => {
          rowData[column.title] = row[column.dataIndex];
        });
        return rowData;
      });
      // console.log(data);
      this.$emit('downloadPart',[this.index,data]);
    },
  },
}
</script>

<style scoped>
.container {
  margin: 36px;
}
</style>
