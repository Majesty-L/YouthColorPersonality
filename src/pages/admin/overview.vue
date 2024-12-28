<template>
  <div class="report-container">
    <div class="filter">
      <div class="left">
        <a-select class="mr" v-model="select.school" :options="options.schoolOptions" @change="(val)=>onChange(val, 'school_name')"></a-select>
        <a-select class="mr" v-model="select.paper" :options="options.paperOptions" @change="(val)=>onChange(val, 'paper_name')"></a-select>
        <a-select class="mr" v-model="select.grade" :options="options.gradeOptions" @change="(val)=>onChange(val, 'grade')"></a-select>
        <a-select class="mr" v-model="select.classNum" :options="options.classOptions"></a-select>
        <a-select class="mr" v-model="select.sex" :options="options.sexOptions"></a-select>
        <a-select class="mr" v-model="select.province" :options="options.areaOptions"></a-select>
        <a-select class="mr" v-model="select.nation" :options="options.nationOptions"></a-select>
        <a-button class="btn-school -btn" @click="search">生成报告</a-button>
      </div>
      <div class="cursor" @click="html2report"><img src="@/assets/school/pdfIcon.png" alt="">下载PDF报告</div>
      <div class="cursor" @click="downloadAnswers"><img src="@/assets/school/pdfIcon.png" alt="">导出源数据</div>
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
      <div class="all-animals" id="animal-intro" v-show="showIntro">
        <h3>形象介绍检索</h3>
        <div class="col" v-for="animal in Object.keys(animalIntro)" :key="animal">
          <img :src="characterIcon[animal]" width="70" height="70" alt="">{{ animalIntro[animal] }}
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { sixGradeMap, allTypeX, bgColorMap, animalIntro, detailDownloadColMapping } from '../school/data.js';
import * as echarts from 'echarts';
import * as characterIcon from '@/assets/characterIcon/index.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const percent = (zi, mu, len = 0) => {
  if (!mu) return '-';
  return zi ? (zi * 100 / mu).toFixed(len) : 0;
}

const initParams = () => {
  return {
    school: '全部学校',
    paper: '全部问卷',
    grade: '全部年级',
    classNum: '全部班级',
    sex: '全部性别',
    province: '全部地区',
    nation: '全部民族',
  }
};
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      percent,
      loading: false,
      options: {
        schoolOptions: [],
        paperOptions: [],
        gradeOptions: [],
        classOptions: [],
        sexOptions: [],
        areaOptions: [],
        nationOptions: [],
      },
      select: {
        school: '全部学校',
        paper: '全部问卷',
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
      originAnswers: {},
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
      animalIntro,
      showIntro: false,
      schoolClassMap: undefined, // 学校到班级映射
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
    // 筛选搜索条件
    search() {
      let copy = {};
      let canUseStorage = true;
      Object.keys(this.select).map(key => {
        copy[key] = this.select[key].includes('全部') ? undefined : this.select[key];
        // 有非学校或问卷的筛选，需要重新拉接口
        if (!['school', 'paper'].includes(key) && copy[key]) {
          canUseStorage = false;
        }
      });
      if (canUseStorage) {
        // 只筛选了学校和问卷，可以从全量数据中拿到
        this.allAnswers = Object.keys(this.originAnswers).reduce((res, cur) => res.concat((!copy.school||cur.includes(copy.school))&&(!copy.paper||cur.includes(copy.paper))&&this.originAnswers[cur] ? this.originAnswers[cur] : []), []);
        this.answerLen = this.allAnswers.length;
        this.transferData(false);
        this.getGradeChart();
        this.getAnimalChart();
      } else {
        this.loading = true;
        const params = copy;
        this.$axios.getPaperReport({isAdmin: true, ...params}).then((res) => {
          this.allAnswers = Object.keys(res).reduce((pre, cur) => {return pre.concat(res[cur] || [])}, []);
          this.answerLen = this.allAnswers.length;
          if (!res || !Object.keys(res).length || !this.answerLen) {
            this.$message.info('暂无数据');
          }
          this.transferData(false);
          this.getGradeChart();
          this.getAnimalChart();
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    // 初始化
    init() {
      this.loading = true;
      this.$axios.getPaperReport({isAdmin: true}).then((res) => {
        if (!res || !Object.keys(res).length) {
          this.$message.info('暂无数据');
        }
        this.originAnswers = res;
        this.allAnswers = Object.keys(res).reduce((pre, cur) => {return pre.concat(res[cur] || [])}, []);
        this.answerLen = this.allAnswers.length;
        this.transferData(true);
        this.getGradeChart();
        this.getAnimalChart();
      }).finally(() => {
        this.loading = false;
      });
    },
    transferData(flash) {
      const sex = { '男': 0, '女': 0 };
      const grade = { '一': 0, '二': 0, '三': 0, '四': 0, '五': 0, '六': 0 };
      const animals = {};
      const detailData = [];
      let options = {
        schoolOptions: new Set(['全部学校']),
        paperOptions: new Set(['全部问卷']),
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
        if (flash) {
          // 初始化时存储好学校到班级的映射
          this.schoolClassMap = this.schoolClassMap?.add(`${item.school_name}_${item.paper_name}_${item.grade}_${item.class_num}`) || new Set([`${item.school_name}_${item.paper_name}_${item.grade}_${item.class_num}`]);
        }
      })
      console.log(this.schoolClassMap)
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
        Object.keys(this.originAnswers).forEach(item => {
          const [schoolName, paperName] = item.split('_');
          options.schoolOptions.add(schoolName);
          options.paperOptions.add(paperName);
        });
        // 筛选下拉
        this.options = {
          schoolOptions: [...options.schoolOptions].map(i => ({value: i, label: i})),
          paperOptions: [...options.paperOptions].map(i => ({value: i, label: i})),
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
              return `<div style="font-size:20px;padding:12px;background-color:#fff;width:400px">
                <div style="display:flex;justify-content:space-between;">
                  <div>色彩形象<br><span style="font-size:32px;font-weight:bold;line-height:110%">${params.data?.name || ''}<br>${params.data?.value || ''}%</span></div>
                  <div><img width=140 height=140 class=mb src=${(characterIcon[params.data?.name] || '').replace(params.data?.name,encodeURIComponent(params.data?.name))} /></div>
                </div>
                <div style="white-space:pre-wrap;font-size:16px;">${(animalIntro[params.data?.name] || '')}</div>
              </div>`;
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
      this.loading = true;
      const element = document.getElementById('per-report');

      // 保存原始的样式
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;

      // 移除高度限制和滚动条
      element.style.height = 'auto';
      element.style.overflow = 'visible';

      this.showIntro = true;
      const element2 = document.getElementById('animal-intro');

      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const width = (canvas.width/canvas.height) * 297;
        const height = 297;

        pdf.addImage(imgData, 'PNG', (210-width)/2, 2, width, height);

        // 恢复原始的样式
        element.style.height = originalHeight;
        element.style.overflow = originalOverflow;

        html2canvas(element2).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const width = (canvas.width/canvas.height) * 297;
          const height = 297;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, 0, width, height);
          pdf.save('年度报告.pdf');
          this.showIntro = false;
          this.loading = false;
        });
      });
    },
    downloadAnswers() {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(this.allAnswers.map(item => {
        let res = {};
        Object.keys(detailDownloadColMapping).forEach((key) => {
          res[detailDownloadColMapping[key]] = item[key];
        })
        return res;
      }));
      XLSX.utils.book_append_sheet(workbook, worksheet);
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, `源数据.xlsx`);
    },
    // 级联
    onChange(val, type) {
      const {school, paper, grade} = this.select;
      const paperList = new Set(['全部问卷']);
      const gradeList = new Set(['全部年级']);
      const classList = new Set(['全部班级']);
      if (type === 'school_name') {
        [...this.schoolClassMap].forEach((key) => {
          const list = key.split('_');
          if (school.includes('全部') || school === list[0]) {
            paperList.add(list[1]);
            gradeList.add(list[2]);
            classList.add(list[3]);
          }
        });
        this.select = {...initParams(), school};
        this.options = { ...this.options, paperOptions: [...paperList].map(i => ({value: i, label: i})), gradeOptions: [...gradeList].map(i => ({value: i, label: i})), classOptions: [...classList].map(i => ({value: i, label: i}))  }
      }
      if (type === 'paper_name') {
        [...this.schoolClassMap].forEach((key) => {
          const list = key.split('_');
          if ((school.includes('全部') || school === list[0]) && (paper.includes('全部') || paper === list[1])) {
            gradeList.add(list[2]);
            classList.add(list[3]);
          }
        });
        this.select = {...initParams(), school, paper};
        this.options = { ...this.options, gradeOptions: [...gradeList].map(i => ({value: i, label: i})), classOptions: [...classList].map(i => ({value: i, label: i}))  }
      }
      if (type === 'grade') {
        [...this.schoolClassMap].forEach((key) => {
          const list = key.split('_');
          if ((school.includes('全部') || school === list[0]) && (paper.includes('全部') || paper === list[1]) && (grade.includes('全部') || grade === list[2])) {
            classList.add(list[3]);
          }
        });
        this.select = {...initParams(), school, paper, grade};
        this.options = { ...this.options, classOptions: [...classList].map(i => ({value: i, label: i}))  }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.report-container {
  padding: 24px;
  color: #414158;

  .filter {
    position: sticky;
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
    // height: 85vh;
    // overflow: auto;

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
.all-animals {
  display: flex;
  flex-direction: column;
  margin: 24px;
  padding: 24px 0;
  .col {
    display: flex;
    align-items: center;
    gap: 45px;
    height: 100px;
    white-space: pre-wrap;
  }
}
</style>