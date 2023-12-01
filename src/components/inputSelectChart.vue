<template>
  <div class="container">
    <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
      <div :id="row.id" style="width: 600px; height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'SelectResultAnalyse',
  props: {
    row: Object,
    index: Number,
    selectedData: {
      type: Array,
      default: ()=>[],
    },
    option: {
      type: Array,
      default: ()=>[],
    },
  },
  data() {
    return {
      paperId: this.$route.params.paper_id,
      myChart: '',
      chartData: [],
      tableCol: [{title:'选项',dataIndex:'code'},{title:'数量',dataIndex:'count'}],
    }
  },
  computed: {
    optionObject() {
      return this.option.reduce((result, item) => {
        result[item.code] = item;
        return result;
      },{})
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      if (this.selectedData) {
        const groupedData = this.selectedData?.reduce((result, item) => {
          const code = item.code;
          if (!result[code]) {
            result[code] = [];
          }
          result[code].push(item);
          return result;
        }, {});
        this.chartData = Object.entries(groupedData).map(([code, option]) => ({ code: this.optionObject[code]?.answer || code, count: option.length })) || [];
      } else {
        this.chartData = [];
      }
      this.initByType();
    },
    initByType() {
      this.myChart = echarts.init(document.getElementById(this.row.id));
      const seriesData = [];
      this.chartData?.forEach((item) => {
        item.count && seriesData.push({name: item.code, value: item.count});
      })
      const option = {
        series: [{
          name: '偏好程度',
          type: 'pie',
          data: seriesData,
        }]
      }
      this.myChart.setOption(option);
      // 向上传递下载参数
      this.downloadPart();
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
