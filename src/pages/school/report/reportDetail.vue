<template>
  <div class="report-container">
    <div class="filter">
      <div class="left">
        <a-select class="mr" v-model="select.grade" :options="options.gradeOptions"></a-select>
        <a-select class="mr" v-model="select.classNum" :options="options.classOptions"></a-select>
        <a-select class="mr" v-model="select.sex" :options="options.sexOptions"></a-select>
        <a-select class="mr" v-model="select.province" :options="options.areaOptions"></a-select>
        <a-select class="mr" v-model="select.nation" :options="options.nationOptions"></a-select>
        <a-button class="btn-school -btn" @click="search">生成报告</a-button>
      </div>
      <div class="cursor" @click="html2report"><img src="@/assets/school/pdfIcon.png" alt="">下载PDF报告</div>
    </div>
    <a-spin :spinning="loading" tip="生成报告中，请勿退出当前页面..." size="large">
      <div class="per-report" id="per-report">
        <div class="level mb">
          <div class="level-left">
            <h3>测试人群</h3>
          </div>
          <div class="level-right">
            <span>本报告测试人数：</span><span class="report-num">{{ answerLen }}</span>
          </div>
        </div>
        <div class="rec-container">
          <div class="sex-part">
            <div class="rectangle">
              <div class="blue" :style="{width:percent(sexData['男'], answerLen)+'%'}"></div>
              <div class="pink" :style="{width:percent(sexData['女'], answerLen)+'%'}"></div>
            </div>
            <div class="level">
              <div class="text-left">
                男<br /><span class="bold">{{ percent(sexData['男'], answerLen) }}%</span>
              </div>
              <div class="text-right">
                女<br /><span class="bold">{{ percent(sexData['女'], answerLen) }}%</span>
              </div>
            </div>
          </div>
          <div class="grade-part">
            <div class="rectangle">
              <div v-for="item, index in gradeNoList" :key="index" :class="`rec color${item.no}`"></div>
            </div>
            <div class="grade-percent">
              <div class="per-grade" v-for="item, index in gradeNoList" :key="index">
                {{ item.name }}<br /><span class="bold">{{ percent(item.percent, answerLen) }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="six-container">
          <h3>色彩心理特征指数</h3>
          <div class="exponent">
            <div class="chart">
              <div class="per" v-for="exponent, index in exponents" :key="index" :id="exponent.dataIndex"></div>
            </div>
            <a-divider class="divider" type="vertical" :dashed="false"></a-divider>
            <div class="num-container">
              <div class="title">平均分</div>
              <div class="num">
                <div class="average" v-for="item, index in average" :key="index">{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="character-container">
          <h3>形象分布</h3>
          <div class="chart" id="animal"></div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { sixGradeMap } from '../data.js';
import * as echarts from 'echarts';
import * as characterIcon from '@/assets/characterIcon/index.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const percent = (zi, mu, len = 0) => {
  if (!mu) return '-';
  return zi ? (zi * 100 / mu).toFixed(len) : 0;
}

const allTypeX = [-10, -9, -8, -7, -6, -5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10];

const bgColorMap = {
  老虎: '#E78148',
  豹子: '#FFBC6E',
  鹦鹉: '#D0DF67',
  河马: '#8F7890',
  猴子: '#7C463A',
  大象: '#EADADB',
  牛: '#DDBBBC',
  鹰: '#C24B54',
  松鼠: '#ED5D2B',
  熊猫: '#E8E8EC',
  骆驼: '#E4B88F',
  狐狸: '#FFB661',
  羊: '#F9EAD9',
  鹿: '#B78461',
  驴: '#9994A0',
  犀牛: '#7A7A7B',
  考拉: '#D3D2BA',
  狮子: '#BA6448',
  孔雀: '#19AB96',
  天鹅: '#EEE3F0',
  兔子: '#F2E7EF',
  猫: '#C8C2D8',
  猫头鹰: '#CABFB3',
};

export default {
  components: {
  },
  props: {
    paperId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      percent,
      loading: false,
      options: {
        gradeOptions: [],
        classOptions: [],
        sexOptions: [],
        areaOptions: [],
        nationOptions: [],
      },
      select: {
        grade: '全部年级',
        classNum: '全部班级',
        sex: '全部性别',
        province: '全部地区',
        nation: '全部民族',
      },
      gradeList: [],
      gradeNoList: [
        { name: '一年级', id: '一', percent: 0, no: 0 },
        { name: '二年级', id: '二', percent: 0, no: 1 },
        { name: '三年级', id: '三', percent: 0, no: 2 },
        { name: '四年级', id: '四', percent: 0, no: 3 },
        { name: '五年级', id: '五', percent: 0, no: 4 },
        { name: '六年级', id: '六', percent: 0, no: 5 },
      ],
      allAnswers: [],
      detailData: [],
      answerLen: 0,
      sexData: {
        '男': 0,
        '女': 0,
      },
      animalsData: {},
      exponents: [
        { text: ['内认同', '外认同'], dataIndex: 'rentong' },
        { text: ['理性', '感性'], dataIndex: 'lixing' },
        { text: ['个性', '群体'], dataIndex: 'geti' },
        { text: ['执行', '幻想'], dataIndex: 'zhixing' },
        { text: ['果断', '清晰'], dataIndex: 'guoduan' },
        { text: ['现实', '理想'], dataIndex: 'xianshi' },
      ],
      characterIcon,
    };
  },
  computed: {
    average() {
      if (!this.answerLen) {
        return ['-', '-', '-', '-', '-', '-'];
      }
      const res = [];
      this.exponents.forEach(item => {
        const data = item.data;
        let number = 0;
        allTypeX.forEach((i, index) => {
          number += ((data[index] || 0) * i);
        })
        const per = (number / this.answerLen).toFixed(2);
        res.push(per);
      });
      return res;
    },
  },
  created() {
    this.init(true);
  },
  methods: {
    search() {
      let copy = {};
      Object.keys(this.select).map(key => {
        copy[key] = this.select[key].includes('全部') ? undefined : this.select[key];
      });
      const params = {
        paperId: this.paperId,
        ...copy,
      };
      this.init(false,params);
    },
    init(flash=false, params={paperId: this.paperId}) {
      this.loading = true;
      this.$axios.getPaperReport(params).then((res) => {
        if (!res.length) {
          this.$message.info('暂无数据');
        }
          this.allAnswers = res;
          // this.allAnswers = [
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '骆驼' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '狐狸' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '羊' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹿' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '犀牛' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '犀牛' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '犀牛' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹰' },
          //   { character_id: 3, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 13, student_id: '1800893297600909313', grade: '3', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '牛' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猴子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '6', class_num: '3', sex: '女', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猫头鹰' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹦鹉' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '羊' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '熊猫' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '兔子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '天鹅' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '松鼠' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '狮子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猫' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '6', class_num: '3', sex: '女', province: '湖南', nation: '汉族', animal: '骆驼' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '驴' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹿' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹿' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '孔雀' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '考拉' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '狐狸' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猴子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '河马' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '豹子' },
          // ];
          this.answerLen = this.allAnswers.length;
          this.transferData(flash);
          this.getGradeChart();
          this.getAnimalChart();
      }).finally(() => {
        this.loading = false;
      });
    },
    transferData(flash) {
      const sex = {
        '男': 0,
        '女': 0,
      };
      const grade = {
        '一': 0,
        '二': 0,
        '三': 0,
        '四': 0,
        '五': 0,
        '六': 0,
      };
      const animals = {};
      const detailData = [];
      let options = {
        gradeOptions: new Set(['全部年级']),
        classOptions: new Set(['全部班级']),
        sexOptions: ['全部性别', '男', '女'],
        areaOptions: new Set(['全部地区']),
        nationOptions: new Set(['全部民族']),
      }
      this.allAnswers.forEach(item => {
        detailData.push({ ...item, sixGrade: sixGradeMap[item.character_id] });
        sex[item.sex]++;
        grade[item.grade]++;
        animals[item.animal] = animals[item.animal] ? animals[item.animal] + 1 : 1;
        options.gradeOptions.add(item.grade);
        options.classOptions.add(item.class_num);
        options.areaOptions.add(item.province);
        options.nationOptions.add(item.nation);
      })
      this.detailData = detailData;
      this.sexData = sex;
      this.animalsData = animals;
      const gradeNo = Object.entries(grade).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
      this.gradeNoList = this.gradeNoList.map(i => {
        i.percent = grade[i.id];
        i.no = gradeNo.indexOf(i.id);
        return i;
      });
      if (flash) {
        // 筛选下拉
        this.options = {
          gradeOptions: [...options.gradeOptions].map(i => ({value: i, label: i})),
          classOptions: [...options.classOptions].map(i => ({value: i, label: i})),
          sexOptions: options.sexOptions.map(i => ({value: i, label: i})),
          areaOptions: [...options.areaOptions].map(i => ({value: i, label: i})),
          nationOptions: [...options.nationOptions].map(i => ({value: i, label: i})),
        };
      }
    },
    getGradeChart() {
      const re = {
        rentong: [],
        lixing: [],
        geti: [],
        zhixing: [],
        guoduan: [],
        xianshi: [],
      };
      this.detailData.forEach(item => {
        item.sixGrade.forEach((i, index) => {
          const xi = allTypeX.indexOf(i);
          const di = ['rentong', 'lixing', 'geti', 'zhixing', 'guoduan', 'xianshi'][index];
          re[di][xi] = re[di][xi] ? re[di][xi] + 1 : 1;
        });
      });
      this.exponents = this.exponents.map(i => ({ ...i, data: re[i.dataIndex] }));
      // 画图
      const that = this;
      this.$nextTick(() => {
        that.exponents.forEach(item => {
          const chart = echarts.init(document.getElementById(item.dataIndex));
          const option = {
            grid: {
              left: '6%', // 调整图表左边距
              right: '6%', // 调整图表右边距
              top: '10%',
              bottom: '20%',
            },
            graphic: [
              {
                type: 'text',
                left: '0%', // 第一个标签的位置
                top: '40%', // 第一个标签的位置
                style: {
                  text: item.text[0], // 第一个标签的文本
                  textAlign: 'center',
                  fill: '#414158', // 第一个标签的颜色
                  fontSize: '16px',
                },
              },
              {
                type: 'text',
                right: '0%', // 第二个标签的位置
                top: '40%', // 第二个标签的位置
                style: {
                  text: item.text[1], // 第二个标签的文本
                  textAlign: 'center',
                  fill: '#414158', // 第二个标签的颜色
                  fontSize: '16px',
                },
              },
            ],
            xAxis: {
              type: 'category',
              axisLabel: {
                color: 'rgba(0, 0, 0, 0.5)', // 设置横坐标标签颜色和透明度
              },
              axisTick: {
                show: false, // 隐藏横坐标刻度线
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(226, 227, 244, 1)', // 设置横坐标轴线颜色和透明度
                },
              },
              splitLine: {
                show: false, // 隐藏横坐标分割线
              },
              boundaryGap: true, // 横坐标两边留白
              data: allTypeX,
            },
            yAxis: {
              type: 'value',
              show: false,
            },
            series: [
              {
                data: item.data,
                itemStyle: {
                  borderRadius: [20, 20, 0, 0],
                  color: '#6C72C9',
                },
                barWidth: '30%',
                type: 'bar',
                stack: 'a',
                name: '+'
              },
              {
                data: item.data.map(i => -i),
                itemStyle: {
                  borderRadius: [0, 0, 20, 20],
                  color: '#6C72C9',
                },
                barWidth: '30%',
                type: 'bar',
                stack: 'a',
                name: '-'
              },
            ]
          };
          chart.setOption(option);
        })
      })
    },
    getAnimalChart() {
      const data = [];
      Object.keys(this.animalsData).forEach((i) => {
        const name = i;
        const value = percent(this.animalsData[i], this.answerLen);
        data.push({
          name,
          value,
          itemStyle: {
            color: bgColorMap[name],
          },
          label: {
            formatter: params => {
              return `{blank|}\n{a|}\n{bold| ${params.name}}\n{percentage| ${params.value}%}`;
            },
            rich: {
              blank: {
                height: 20, // 调整这个值来改变空白的大小
              },
              a: {
                backgroundColor: {
                  image: characterIcon[name]
                },
                height: 100,
                align: 'center', // 图片水平居中
              },
              bold: {
                fontSize: 20,
                fontWeight: 'bold',
                align: 'center', // 图片水平居中
              },
              percentage: {
                fontSize: 20,
                align: 'center', // 图片水平居中
              },
            }
          }
        });
      });
      // 画图
      this.$nextTick(() => {
        const chart = echarts.init(document.getElementById('animal'));
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              if (!params.data?.name) return '';
              return `<div style="font-size:20px;padding:12px;background-color:${params.data?.itemStyle?.color || '#fff'}"><img class=mr src=${(characterIcon[params.data?.name] || '').replace(params.data?.name,encodeURIComponent(params.data?.name))} />${params.data?.name || ''}: ${params.data?.value || ''}%</div>`;
            },
          },
          grid: {
            left: '0%', // 调整图表左边距
            right: '0%', // 调整图表右边距
            top: '0%',
            bottom: '0%',
          },
          series: [
            {
              left: 0,
              right: 0,
              top: 10,
              bottom: 20,
              type: 'treemap',
              roam: false, 
              nodeClick: false, 
              breadcrumb: {
                show: false, // 隐藏树状结构
              },
              levels: [
                {
                  itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 4,
                    gapWidth: 4
                  }
                },
              ],
              data,
            },
          ],
        };
        chart.setOption(option);
      })
    },
    html2report() {
      const element = document.getElementById('per-report');

      // 保存原始的样式
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;

      // 移除高度限制和滚动条
      element.style.height = 'auto';
      element.style.overflow = 'visible';


      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const width = (canvas.width/canvas.height) * 297;
        const height = 297;

        pdf.addImage(imgData, 'PNG', (210-width)/2, 5, width, height);
        pdf.save('年度报告.pdf');

        // 恢复原始的样式
        element.style.height = originalHeight;
        element.style.overflow = originalOverflow;
      });
    },
  }
}
</script>

<style lang="less" scoped>
.report-container {
  color: #414158;

  .filter {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .-btn {
      width: 120px;
      height: 30px;
      font-size: 14px;
    }

    /deep/.ant-select {
      width: 120px;
    }

    /deep/.ant-select-selection {
      border-radius: 24px;
    }

    /deep/.ant-select-selection-selected-value {
      margin-left: 12px;
    }
  }

  .loading {
    height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .per-report {
    margin-top: 12px;
    background-color: #fff;
    border-radius: 12px;
    padding: 12px 36px;
    height: 85vh;
    overflow: auto;

    .level {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .report-num {
        color: #6C72C9;
        font-size: 48px;
        font-weight: bold;
      }

      .level-right {
        display: flex;
        align-items: center;
      }
    }

    .rec-container {
      display: flex;
      justify-content: space-between;
    }

    .sex-part {
      width: 500px;

      .bold {
        font-weight: bold;
        font-size: 24px;
      }

      .text-left {
        color: #8ACCE4;
      }

      .text-right {
        color: #F4A6A6;
        text-align: end;
      }

      .rectangle {
        height: 48px;
        position: relative;
      }

      .blue {
        width: 50%;
        height: 100%;
        background-color: #8ACCE4;
        position: absolute;
        left: 0;
      }

      .pink {
        width: 50%;
        height: 100%;
        background-color: #F4A6A6;
        position: absolute;
        right: 0;
      }
    }

    .grade-part {
      width: 800px;

      .rectangle {
        display: flex;
      }

      .rec {
        flex: 1;
        height: 48px;
        position: relative;
      }

      .color {
        background-color: #fff;
      }

      .color0 {
        background-color: #6C72C9;
      }

      ;

      .color1 {
        background-color: #8489D2;
      }

      ;

      .color2 {
        background-color: #9DA1DB;
      }

      ;

      .color3 {
        background-color: #B5B8E4;
      }

      ;

      .color4 {
        background-color: #CED0ED;
      }

      ;

      .color5 {
        background-color: #E2E3F4;
      }

      ;

      .grade-percent {
        display: flex;
        justify-content: space-around;
        text-align: center;

        .bold {
          font-weight: bold;
          font-size: 24px;
        }
      }
    }

    .six-container {
      margin-top: 48px;

      .exponent {
        display: flex;

        .per {
          width: 1000px;
          height: 150px;
        }

        .divider {
          margin-left: 100px;
          position: relative;
          height: 900px;
        }

        .num-container {
          width: 300px;

          .title {
            text-align: center;
            font-size: 20px;
          }

          .num {
            margin-top: 24px;
            height: 780px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .average {
              color: #6C72C9;
              font-weight: bold;
              font-size: 24px;
            }
          }
        }
      }
    }

    .character-container {
      margin-top: 48px;

      .chart {
        width: 1300px;
        height: 1000px;
      }
    }
  }
}
</style>