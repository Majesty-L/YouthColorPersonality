<template>
  <div class="report-container">
    <div class="filter">
      <a-select v-model="gradeName" :options="gradeSelectList"></a-select>
      <a-button @click="search"></a-button>
    </div>
    <div class="per-report">
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
            <div class="blue"></div>
            <div class="pink"></div>
          </div>
          <div class="level">
            <div class="level-left">
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
    <div class="loading" v-if="loading">

    </div>
  </div>
</template>

<script>
import { sixGradeMap } from '../data.js';
import * as echarts from 'echarts';
import * as characters from '@/assets/characters/index.js';

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
      gradeName: '全部年级',
      loading: false,
      gradeSelectList: [{label:'一年级', value: '1'}],
      gradeList: [],
      gradeNoList: [
        { name: '一年级', id: '1', percent: 0, no: 0 },
        { name: '二年级', id: '2', percent: 0, no: 1 },
        { name: '三年级', id: '3', percent: 0, no: 2 },
        { name: '四年级', id: '4', percent: 0, no: 3 },
        { name: '五年级', id: '5', percent: 0, no: 4 },
        { name: '六年级', id: '6', percent: 0, no: 5 },
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
      characters,
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
    this.init();
  },
  methods: {
    search() {
      const params = {
        paperId: this.paperId,
        grade: this.gradeName,
      };
      this.init(params);
    },
    init(params={paperId: this.paperId}) {
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
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '犀牛' },
          //   { character_id: 3, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 13, student_id: '1800893297600909313', grade: '3', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '牛' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猴子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '6', class_num: '3', sex: '女', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猫头鹰' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '狐狸' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猫头鹰' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猫头鹰' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹦鹉' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹦鹉' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹦鹉' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '熊猫' },
          // ];
          this.answerLen = this.allAnswers.length;
          this.transferData();
          this.getGradeChart();
          this.getAnimalChart();
      });
    },
    transferData() {
      const sex = {
        '男': 0,
        '女': 0,
      };
      const grade = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0,
      };
      const animals = {};
      const detailData = [];
      this.allAnswers.forEach(item => {
        detailData.push({ ...item, sixGrade: sixGradeMap[item.character_id] });
        sex[item.sex]++;
        grade[item.grade]++;
        animals[item.animal] = animals[item.animal] ? animals[item.animal] + 1 : 1;
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
              return `{a|}\n{bold| ${params.name}}\n{percentage| ${params.value}%}`;
            },
            rich: {
              a: {
                backgroundColor: {
                  image: characters[name]
                },
                height: 100,
                align: 'center',
                className: 'center-image',
              },
              bold: {
                fontSize: 20,
                fontWeight: 'bold',
                align: 'center', // 文字居中对齐
              },
              percentage: {
                fontSize: 20,
                align: 'center', // 文字居中对齐
              },
            }
          }
        });
      });
      // 画图
      this.$nextTick(() => {
        const chart = echarts.init(document.getElementById('animal'));
        const option = {
          grid: {
            left: '0%', // 调整图表左边距
            right: '0%', // 调整图表右边距
            top: '0%',
            bottom: '0%',
          },
          series: [
            {
              type: 'treemap',
              roam: false, 
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
  }
}
</script>

<style lang="less" scoped>
.report-container {
  color: #414158;

  .filter {
    margin-top: 12px;

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
        width: 60%;
        height: 100%;
        background-color: #8ACCE4;
        position: absolute;
        left: 0;
      }

      .pink {
        width: 40%;
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
        width: 1400px;
        height: 1000px;
      }
    }
  }
}
.center-image {
  background-position: center;
}
</style>