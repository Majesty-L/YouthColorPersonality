<template>
  <div class="container">
    <a-page-header
      :title="quesId?'管理页':'问卷页'"
      @back="back"
    />
    <h1>结果页</h1>
    <div v-if="!([4,6].includes(row.type))">
      <div id="normalPie" style="width: 600px; height: 400px;"></div>
    </div>
    <div v-else-if="row.type==4">
      <div style="display: flex;flex-wrap: wrap;">
        <div id="phasePie" style="width: 600px; height: 400px;"></div>
        <div id="huePie" style="width: 600px; height: 400px;"></div>
      </div>
      <div style="display: flex;flex-wrap: wrap;">
        <div id="phaseLike" style="width: 600px; height: 400px;"></div>
        <div id="phaseDislike" style="width: 600px; height: 400px;"></div>
      </div>
      <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
        <canvas id="hueLike" width="400" height="400">
        Your browser does not support the HTML5 canvas tag.
        </canvas>
        <canvas id="hueDislike" width="400" height="400">
        Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
      <div style="display: flex;flex-wrap: wrap;justify-content: space-between;">
        <div style="width: 600px;">
          <a-button @click="download('phase')">导出</a-button>
          <a-table rowKey="phase" :columns="phaseTableCol" :data-source="phaseTable" :pagination="false"></a-table>
        </div>
        <div style="width: 600px;">
          <a-button @click="download('hue')">导出</a-button>
          <a-table rowKey="hue" :columns="hueTableCol" :data-source="hueTable" :pagination="false"></a-table>
        </div>
      </div>
    </div>
    <div v-else-if="row.type===6">
      <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
        <canvas id="stripeLike" width="950" height="850">
        Your browser does not support the HTML5 canvas tag.
        </canvas>
        <div>
          <a-button @click="download('stripe')">导出</a-button>
          <a-table rowKey="id" :columns="stripeTableCol" :data-source="stripeTable" :pagination="false"></a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {colorMap} from '@/assets/data.js'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import hue from '@/assets/hue.png'
import stripe from '@/assets/stripe.png'
export default {
  name: 'ResultAnalyse',
  props: {
    msg: String
  },
  data() {
    return {
      paperId: this.$route.params.paper_id,
      quesId: Number(this.$route.params.question_id),
      chartType: this.$route.query.chart,
      row: this.$route.query.row,
      myChart: '',
      chartData: [],
      phaseTableCol: [{title: '色相',dataIndex: 'phase'},{title: '数量',dataIndex: 'count'},{title: '占比',dataIndex: 'percent'}],
      phaseTable: [],
      hueTableCol: [{title: '色调',dataIndex: 'hue'},{title: '数量',dataIndex: 'count'},{title: '占比',dataIndex: 'percent'}],
      hueTable: [],
      stripeTableCol: [{title: '序号',dataIndex: 'id'},{title: '数量',dataIndex: 'count'},{title: '占比',dataIndex: 'percent'}],
      stripeTable: [],
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    create() {
      console.log('create');
    },
    initChart() {
      this.$axios.getChartData({question_id:this.quesId, type:this.row.type}).then(({data})=>{
        this.chartData = data.data;
        this.initByType(this.row.type);
      });
    },
    initByType(type) {
      if (!([4,6].includes(type))) {
        this.myChart = echarts.init(document.getElementById('normalPie'));
        const seriesData = this.chartData.map((item) => ({name: item.option.answer, value: item.count}))
        const option = {
          series: [{
            name: '偏好程度',
            type: 'pie',
            data: seriesData,
          }]
        }
        this.myChart.setOption(option);
      } else if (type === 4) {
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
        // 色相饼图
        this.myChart = echarts.init(document.getElementById('phasePie'));
        const phaseDataArray = [];
        for (const key in phaseData) {
          phaseDataArray.push({name:key,value:phaseData[key]});
        }
        const option1 = {
          series: [{
            name: '色相偏好程度',
            type: 'pie',
            data: phaseDataArray,
          }]
        }
        this.myChart.setOption(option1);
        // 色调饼图
        this.myChart = echarts.init(document.getElementById('huePie'));
        const hueDataArray = [];
        for (const key in hueData) {
          hueDataArray.push({name:key,value:hueData[key]});
        }
        const option2 = {
          series: [{
            name: '色调偏好程度',
            type: 'pie',
            data: hueDataArray,
          }]
        }
        this.myChart.setOption(option2);
        // console.log(this.chartData,phaseData,hueData,phaseDataArray,hueDataArray);
        // 色相正偏好图
        this.myChart = echarts.init(document.getElementById('phaseLike'));
        const phasePrefer = phaseDataArray.map((item,index) => {
          return [0, index, item.value];
        });
        // console.log(phasePrefer)
        const option3 = {
          title: {
            text: '色相正偏好图'
          },
          polar: {},
          angleAxis: {
            type: 'category',
            data: ['','','','','','','','','',''],
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
                return item[2]*50/dataLen;
              },
              data: phasePrefer,
              animationDelay: function (idx) {
                return idx * 5;
              }
            }
          ]
        };
        this.myChart.setOption(option3);
        // 色相负偏好图
        this.myChart = echarts.init(document.getElementById('phaseDislike'));
        // console.log(phasePrefer)
        const option4 = {
          title: {
            text: '色相负偏好图'
          },
          polar: {},
          angleAxis: {
            type: 'category',
            data: ['','','','','','','','','',''],
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
                return 20-item[2]*50/dataLen;
              },
              data: phasePrefer,
              animationDelay: function (idx) {
                return idx * 5;
              }
            }
          ]
        };
        this.myChart.setOption(option4);
        // 色调正偏好图
        const canvasLike = document.getElementById('hueLike');
        const contextLike = canvasLike.getContext('2d');
        const imageLike = new Image();
        imageLike.src = hue;
        imageLike.onload = function() {
          contextLike.drawImage(imageLike, 0, 0);
          const stats = [
              {x: 73, y: 71},  // Vp
              {x: 73, y: 135},  // Lgr
              {x: 73, y: 198},  // Gr
              {x: 73, y: 262},  // Dgr
              {x: 137, y: 72},  // P
              {x: 137, y: 135},  // L
              {x: 137, y: 198},  // Di
              {x: 137, y: 262},  // Dk
              {x: 200, y: 104},  // B
              {x: 200, y: 166},  // S
              {x: 200, y: 229},  // Dp
              {x: 264, y: 166}  // V
          ];
          for (let i = 0; i < stats.length; i++) {
            const stat = stats[i];
            contextLike.beginPath();
            contextLike.arc(stat.x, stat.y, 30, 0, 2 * Math.PI, true);
            contextLike.stroke();
          }
        }
        // 色调负偏好图
        const canvasDislike = document.getElementById('hueDislike');
        const contextDislike = canvasDislike.getContext('2d');
        const imageDislike = new Image();
        imageDislike.src = hue;
        imageDislike.onload = function() {
          contextDislike.drawImage(imageDislike, 0, 0);
          const stats = [
              {x: 73, y: 71},  // Vp
              {x: 73, y: 135},  // Lgr
              {x: 73, y: 198},  // Gr
              {x: 73, y: 262},  // Dgr
              {x: 137, y: 72},  // P
              {x: 137, y: 135},  // L
              {x: 137, y: 198},  // Di
              {x: 137, y: 262},  // Dk
              {x: 200, y: 104},  // B
              {x: 200, y: 166},  // S
              {x: 200, y: 229},  // Dp
              {x: 264, y: 166}  // V
          ];
          for (let i = 0; i < stats.length; i++) {
            const stat = stats[i];
            contextDislike.beginPath();
            contextDislike.arc(stat.x, stat.y, 30, 0, 2 * Math.PI, true);
            contextDislike.stroke();
          }
        }
        this.tableData(phaseDataArray,hueDataArray,dataLen);
      } else if (type === 6) {
        // 色条正偏好图
        const canvasLike = document.getElementById('stripeLike');
        const contextLike = canvasLike.getContext('2d');
        const stripeLike = new Image();
        stripeLike.src = stripe;
        stripeLike.onload = function() {
          contextLike.drawImage(stripeLike, 10, 10);
          const stats = [
              {x: 164, y: 178},  // 可爱的 1
              {x: 470, y: 234},  // 细致的 2
              {x: 585, y: 330},  // 安静的 3
              {x: 751, y: 328},  // 清冽的 4
              {x: 604, y: 514},  // 知性的 5
              {x: 751, y: 544},  // 锋利的 6
              {x: 318, y: 385},  // 质朴寡言的 7
              {x: 234, y: 518},  // 华丽的 8
              {x: 389, y: 612},  // 古典的 9
              {x: 234, y: 720},  // 健壮的 10
              {x: 116, y: 616},  // 刺激的 11
              {x: 318, y: 308},  // 自然的 12
              {x: 613, y: 690},  // 高贵的 13
              {x: 585, y: 385},  // 知性优雅的 14
              {x: 736, y: 128},  // 清净的 15
              {x: 335, y: 94},   // 楚楚动人的 16
              {x: 335, y: 178},  // 温润的 17
              {x: 142, y: 244},  // 轻松的 18
              {x: 126, y: 440},  // 热闹的 19
              {x: 142, y: 300},  // 高兴的 20
              {x: 737, y: 378},  // 青春洋溢的 21
              {x: 482, y: 460},  // 风流的 22
              {x: 444, y: 178},  // 安宁的 23
              {x: 444, y: 514},  // 乡土气息的 24
              {x: 394, y: 730},  // 厚重的 25
              {x: 253, y: 566},  // 丰富的 26
              {x: 138, y: 384},  // 闲适的 27
              {x: 738, y: 612},  // 敏锐的 28
              {x: 108, y: 680},  // 动感的 29
              {x: 505, y: 718},  // 有格调的 30
              {x: 471, y: 384},  // 优雅的 31
              {x: 566, y: 86},  // 浪漫的 32
              {x: 672, y: 276},  // 新鲜的 33
              {x: 585, y: 212},  // 自然的 34
              {x: 454, y: 284},  // 有品味的 35
              {x: 604, y: 612},  // 凛然的 36
              {x: 499, y: 612},  // 考究的 37
              {x: 234, y: 616},  // 豪华的 38
              {x: 108, y: 546},  // 跃动的 39
              {x: 746, y: 664},  // 合理的 40
              {x: 750, y: 182},  // 清雅的 41
              {x: 585, y: 152},  // 简朴的 42
              {x: 424, y: 342},  // 优美的 43
          ];
          for (let i = 0; i < stats.length; i++) {
            const stat = stats[i];
            contextLike.beginPath();
            contextLike.rect(stat.x, stat.y, 102, 44);
            contextLike.stroke();
          }
        }
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
      }
    },
    tableData(phase,hue,dataLen) {
      this.phaseTable = phase.map(item=>({phase:item.name,count:item.value,percent:(item.value/dataLen).toFixed(2)}));
      this.hueTable = hue.map(item=>({hue:item.name,count:item.value,percent:(item.value/dataLen).toFixed(2)}));
      console.log(this.phaseTable,this.hueTable)
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
  },
}
</script>

<style scoped>
.container {
  margin: 36px;
}
</style>
