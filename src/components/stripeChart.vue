<template>
  <div class="container">
    <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
      <canvas id="stripeLike" width="850" height="850">
      Your browser does not support the HTML5 canvas tag.
      </canvas>
      <div>
        <a-button @click="download('stripe')">导出</a-button>
        <a-table rowKey="id" :columns="stripeTableCol" :data-source="stripeTable" :pagination="false"></a-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import stripe from '@/assets/stripe.png'
import {getTopThree} from '@/utils/common.js';
const stripeStats = [
  {},
  {x: 108, y: 176},  // 可爱的 1
  {x: 408, y: 234},  // 细致的 2
  {x: 521, y: 332},  // 安静的 3
  {x: 683, y: 331},  // 清冽的 4
  {x: 538, y: 521},  // 知性的 5
  {x: 682, y: 553},  // 锋利的 6
  {x: 258, y: 389},  // 质朴寡言的 7
  {x: 177, y: 524},  // 华丽的 8
  {x: 329, y: 622},  // 古典的 9
  {x: 175, y: 732},  // 健壮的 10
  {x: 60, y: 624},  // 刺激的 11
  {x: 258, y: 310},  // 自然的 12
  {x: 548, y: 700},  // 高贵的 13
  {x: 522, y: 388},  // 知性优雅的 14
  {x: 669, y: 124},  // 清净的 15
  {x: 276, y: 91},   // 楚楚动人的 16
  {x: 275, y: 177},  // 温润的 17
  {x: 86, y: 244},  // 轻松的 18
  {x: 70, y: 444},  // 热闹的 19
  {x: 86, y: 300},  // 高兴的 20
  {x: 670, y: 382},  // 青春洋溢的 21
  {x: 419, y: 466},  // 风流的 22
  {x: 382, y: 176},  // 安宁的 23
  {x: 383, y: 521},  // 乡土气息的 24
  {x: 332, y: 742},  // 厚重的 25
  {x: 195, y: 574},  // 丰富的 26
  {x: 81, y: 386},  // 闲适的 27
  {x: 670, y: 620},  // 敏锐的 28
  {x: 54, y: 690},  // 动感的 29
  {x: 442, y: 729},  // 有格调的 30
  {x: 410, y: 387},  // 优雅的 31
  {x: 503, y: 82},  // 浪漫的 32
  {x: 606, y: 276},  // 新鲜的 33
  {x: 521, y: 212},  // 自然的 34
  {x: 391, y: 284},  // 有品味的 35
  {x: 541, y: 620},  // 凛然的 36
  {x: 437, y: 620},  // 考究的 37
  {x: 177, y: 625},  // 豪华的 38
  {x: 53, y: 554},  // 跃动的 39
  {x: 679, y: 674},  // 合理的 40
  {x: 684, y: 179},  // 清雅的 41
  {x: 521, y: 149},  // 简朴的 42
  {x: 362, y: 344},  // 优美的 43
];
export default {
  name: 'StripeResultAnalyse',
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
      paperId: this.$route.params.paper_id,
      myChart: '',
      chartData: [],
      stripeTableCol: [{title: '序号',dataIndex: 'id'},{title: '数量',dataIndex: 'count'},{title: '占比',dataIndex: 'percent'}],
      stripeTable: [],
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
      // console.log(this.selectedData);
      this.chartData = this.selectedData;
      this.initByType();
    },
    initByType() {
      const stripeLen = this.chartData.length;
      const stripeData = {};
      const stripeArrayData = [];
      for (const item of this.chartData) {
        if (!stripeData[item.code]) {
          stripeData[item.code] = 0;
        }
        stripeData[item.code]++;
      }
      for (const key in stripeData) {
        stripeArrayData.push({id:Number(key),count:stripeData[key],percent:(stripeData[key]/stripeLen).toFixed(2)});
      }
      this.stripeTable = stripeArrayData;
      const topTree = getTopThree(stripeArrayData);
      // 色条正偏好图
      const canvasLike = document.getElementById('stripeLike');
      const contextLike = canvasLike.getContext('2d');
      const stripeLike = new Image();
      stripeLike.src = stripe;
      stripeLike.onload = function() {
        contextLike.drawImage(stripeLike, 10, 10, canvasLike.width, canvasLike.height);
        topTree.forEach(item => {
          const stat = stripeStats[item.id];
          contextLike.beginPath();
          contextLike.rect(stat.x, stat.y, 102, 44);
          contextLike.strokeStyle = 'red';
          contextLike.lineWidth = 3;
          contextLike.stroke();
        })
        // for (let i = 1; i <= 43; i++) {
        //   const stat = stripeStats[i];
        //   contextLike.beginPath();
        //   contextLike.rect(stat.x, stat.y, 102, 44);
        //   contextLike.stroke();
        // }
      }

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
      const tableData = this.stripeTable;
      const tableColumns = this.stripeTableCol;
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
