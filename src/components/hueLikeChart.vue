<template>
  <div class="container">
    <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
      <div :id="'phasePie-'+row.id" style="width: 500px; height: 400px;"></div>
      <div :id="'huePie-'+row.id" style="width: 500px; height: 400px;"></div>
    </div>
    <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
      <div :id="'phaseLike-'+row.id" style="width: 500px; height: 400px;"></div>
      <canvas :id="'hueLike-'+row.id" width="400" height="400">
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
    <div style="display: flex;flex-wrap: wrap;justify-content: space-between;margin-top: 12px;">
      <div style="width: 500px;">
        <a-button @click="download('phase')">导出</a-button>
        <a-table rowKey="phase" :columns="phaseTableCol" :data-source="phaseTable" :pagination="false"></a-table>
      </div>
      <div style="width: 500px;">
        <a-button @click="download('hue')">导出</a-button>
        <a-table rowKey="hue" :columns="hueTableCol" :data-source="hueTable" :pagination="false"></a-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { colorMap } from '@/assets/data.js'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import hue from '@/assets/hue.png';
import {getTopThree} from '@/utils/common.js';

const HueStats = {
  Vp: { x: 97, y: 88, color: '#cb312c' },  // Vp
  Lgr: { x: 98, y: 171, color: '#ba3b33' },  // Lgr
  Gr: { x: 98, y: 252, color: '#ef776a' },  // Gr
  Dgr: { x: 97, y: 338, color: '#f4a999' },  // Dgr
  P: { x: 179, y: 98, color: '#f5d8ce' },  // P
  L: { x: 179, y: 171, color: '#d0bdbd' },  // L
  Di: { x: 178, y: 249, color: '#e6948d' },  // Di
  Dk: { x: 178, y: 324, color: '#7c5c5c' },  // Dk
  B: { x: 258, y: 129, color: '#ad7d77' },  // B
  S: { x: 258, y: 206, color: '#ab2841' },  // S
  Dp: { x: 259, y: 288, color: '#791e38' },  // Dp
  V: { x: 339, y: 205, color: '#553712' },  // V
  N: { x: 20, y: 0, color: '#f6f8f7' }  // N
};

const pieColor = {
  '红': '#ef776a',
  '橙': '#f4b26b',
  '黄': '#fbd43f',
  '黄绿': '#c2d742',
  '绿': '#14b890',
  '蓝绿': '#47c1bf',
  '蓝': '#3fc0bf',
  '青紫': '#7c6fb3',
  '紫': '#c099c4',
  '红紫': '#eaa1bb',
}

export default {
  name: 'HueResultAnalyse',
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
      phaseTableCol: [{ title: '色相', dataIndex: 'phase' }, { title: '数量', dataIndex: 'count' }, { title: '占比', dataIndex: 'percent' }],
      phaseTable: [],
      hueTableCol: [{ title: '色调', dataIndex: 'hue' }, { title: '数量', dataIndex: 'count' }, { title: '占比', dataIndex: 'percent' }],
      hueTable: [],
      windowWidth: window.innerWidth,
    }
  },
  // watch: {
  //   selectedData: {
  //     handler(v) {
  //       console.log(v)
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
      this.initByType();
    },
    getPhaseAndHueData() {
      const phaseData = {};
      const hueData = {};
      const dataLen = this.chartData.length;
      for (const item of this.chartData) {
        for (const obj of colorMap) {
          if (obj.id === Number(item.code)) {
            if (!phaseData[obj.phase]) {
              phaseData[obj.phase] = 0;
            }
            if (!hueData[obj.hue]) {
              hueData[obj.hue] = 0;
            }
            phaseData[obj.phase]++;
            hueData[obj.hue]++;
          }
        }
      }
      return { phaseData, hueData, dataLen };
    },
    paintPhasePie(phaseData) {
      if (this[`phasePie${this.row.id}`]) {
        this[`phasePie${this.row.id}`].dispose();
      }
      this[`phasePie${this.row.id}`] = echarts.init(document.getElementById(`phasePie-${this.row.id}`));
      const phaseDataArray = [];
      for (const key in phaseData) {
        phaseDataArray.push({ name: key, value: phaseData[key], itemStyle: { color: pieColor[key] } });
      }
      const option1 = {
        legend:{
          show: this.windowWidth < 500 ? true : false,
        },
        series: [{
          name: '色相偏好程度',
          type: 'pie',
          data: phaseDataArray,
          label: {
            show: this.windowWidth < 500 ? false : true,
          },
        }]
      }
      this[`phasePie${this.row.id}`].setOption(option1,true);
      return phaseDataArray;
    },
    paintHuePie(hueData) {
      if (this[`huePie${this.row.id}`]) {
        this[`huePie${this.row.id}`].dispose();
      }
      this[`huePie${this.row.id}`] = echarts.init(document.getElementById(`huePie-${this.row.id}`));
      const hueDataArray = [];
      for (const key in hueData) {
        hueDataArray.push({ name: key, value: hueData[key], itemStyle: { color: HueStats[key]?.color } });
      }
      const option2 = {
        legend:{
          show: this.windowWidth < 500 ? true : false,
        },
        series: [{
          name: '色调偏好程度',
          type: 'pie',
          data: hueDataArray,
          label: {
            show: this.windowWidth < 500 ? false : true,
          },
        }]
      }
      this[`huePie${this.row.id}`].setOption(option2,true);
      return hueDataArray;
    },
    paintPhaseLike(phaseDataArray) {
      if (this[`phaseLike${this.row.id}`]) {
        this[`phaseLike${this.row.id}`].dispose();
      }
      this[`phaseLike${this.row.id}`] = echarts.init(document.getElementById(`phaseLike-${this.row.id}`));
      const phasePrefer = [];
      Object.keys(pieColor).forEach((item, index) => {
        const phaseValue = phaseDataArray.find(i => i.name === item)?.value || 0;
        phasePrefer.push([0, index, phaseValue, item]);
      });
      const maxPhase = getTopThree(phasePrefer,2)[0][2] || 1;
      // console.log(maxPhase)
      // console.log(phaseDataArray,phasePrefer)
      const option3 = {
        // title: {
        //   text: '色相正偏好图'
        // },
        // color: ['#CA322C','#F7931D','#FAD422','#BBD23B','#00A55F','#00A18F','#0086A5','#61489C','#8F569D','#C2317F'],
        polar: {},
        angleAxis: {
          type: 'category',
          data: ['', '', '', '', '', '', '', '', '', ''],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        radiusAxis: {
          type: 'category',
          data: [''],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: 'Punch Card',
            type: 'scatter',
            coordinateSystem: 'polar',
            symbolSize: function (item) {
              return (item[2] * 40 / maxPhase) + 10;
            },
            data: phasePrefer.map((item) => ({value: item, itemStyle: {color: pieColor[item[3]]}})),
            animationDelay: function (idx) {
              return idx * 5;
            },
            itemStyle: {
              opacity: 1,
            }
          }
        ]
      };
      this[`phaseLike${this.row.id}`].setOption(option3,true);
    },
    paintHueLike(hueDataArray) {
      const topTree = getTopThree(hueDataArray,'value');
      // const topTree = ['Vp','Lgr','Gr','Dgr','P','L','Di','Dk','B','S','Dp','V','N'];
      this[`hueLike-${this.row.id}`] = document.getElementById(`hueLike-${this.row.id}`);
      const contextLike = this[`hueLike-${this.row.id}`].getContext('2d');
      // const imageLike = new Image();
      // imageLike.src = hue;
      // imageLike.onload = () => {
      //   contextLike.drawImage(imageLike, 0, 0, this[`hueLike-${this.row.id}`].width, this[`hueLike-${this.row.id}`].height);
      //   topTree.forEach(item => {
      //     const stat = HueStats[item.name];
      //     // const stat = HueStats[item];
      //     contextLike.beginPath();
      //     item.name==='N'?contextLike.rect(stat.x, stat.y, 26, 395):contextLike.arc(stat.x, stat.y, 35, 0, 2 * Math.PI, true);
      //     contextLike.stroke();
      //   })
      // }

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = this[`hueLike-${this.row.id}`].width;
      offscreenCanvas.height = this[`hueLike-${this.row.id}`].height;
      const offscreenContext = offscreenCanvas.getContext('2d');

      // 创建图像
      const imageLike = new Image();
      imageLike.src = hue;

      // 在图像加载完成后，将它绘制到离屏Canvas上
      imageLike.onload = function() {
        offscreenContext.drawImage(imageLike, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        topTree.forEach(item => {
          const stat = HueStats[item.name];
          offscreenContext.beginPath();
          item.name==='N'?offscreenContext.rect(stat.x, stat.y, 26, 395):offscreenContext.arc(stat.x, stat.y, 35, 0, 2 * Math.PI, true);
          offscreenContext.stroke();
        })

        // 将离屏Canvas的内容绘制到屏幕上的Canvas
        contextLike.drawImage(offscreenCanvas, 0, 0);
      }
    },
    initByType() {
      const { phaseData, hueData, dataLen } = this.getPhaseAndHueData();
      // 色相饼图
      const phaseDataArray = this.paintPhasePie(phaseData);
      // 色调饼图
      const hueDataArray = this.paintHuePie(hueData);
      // 色相正偏好图
      this.paintPhaseLike(phaseDataArray,dataLen);
      // 色调正偏好图
      this.paintHueLike(hueDataArray);

      this.tableData(phaseDataArray, hueDataArray, dataLen);
      
      // 向上传递下载参数
      this.downloadPart();
    },
    tableData(phase, hue, dataLen) {
      this.phaseTable = phase.map(item => ({ phase: item.name, count: item.value, percent: (item.value / dataLen).toFixed(2) }));
      this.hueTable = hue.map(item => ({ hue: item.name, count: item.value, percent: (item.value / dataLen).toFixed(2) }));
      // console.log(this.phaseTable, this.hueTable)
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
      const phaseTableData = this.phaseTable;
      const phaseTableColumns = this.phaseTableCol;
      const phaseData = phaseTableData.map(row => {
        const rowData = {};
        phaseTableColumns.forEach(column => {
          rowData[column.title] = row[column.dataIndex];
        });
        return rowData;
      });
      const hueTableData = this.hueTable;
      const hueTableColumns = this.hueTableCol;
      const hueData = hueTableData.map(row => {
        const rowData = {};
        hueTableColumns.forEach(column => {
          rowData[column.title] = row[column.dataIndex];
        });
        return rowData;
      });
      // console.log(phaseData,hueData);
      this.$emit('downloadPart',[this.index,phaseData,hueData]);
    },
  },
}
</script>

<style scoped>
.container {
  margin: 36px;
}
</style>
