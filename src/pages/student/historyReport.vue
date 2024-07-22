<template>
  <div class="report-container">
    <headerPart :type="2" @getStudentInfo="getStudentInfo"></headerPart>
    <div class="content">
      <div class="self-info">
        <img src="@/assets/student/avator-big.png" alt="avatar" />
        <div class="title">{{ studentInfo.name }}</div>
        <div class="remove" @click="deleteLocal">退出登录</div>
        <div class="detail-info"><span class="detail-info-before mr"></span>学号 {{ studentInfo.classId }}</div>
        <div class="detail-info"><span class="detail-info-before mr"></span>性别 {{ studentInfo.sex }}</div>
        <div class="detail-info"><span class="detail-info-before mr"></span>地区 {{ studentInfo.province }}</div>
      </div>
      <div class="report-detail">
        <div class="head">
          <div class="">
            <h2>我的报告</h2>
            <a-button @click="html2report">下载PDF报告</a-button>
          </div>
          <div class="all-reports">
            <div v-for="report,index in reportList" :key="index">
              <a-tag :class="{'report-tag': true, 'select': !!(selectReport.paperId === report.paperId)}" @click="onClickReport(report)">{{ report.name }}</a-tag>
            </div>
          </div>
        </div>
        <div id="report" class="report">
          <div class="first-line">
            <div class="status">最近，我的状态是</div>
            <div class="parent"><a-icon :type="(studentInfo.known && studentInfo.known[selectReport.paperId] === '是') ? 'check-circle' : 'close-circle'" theme="twoTone" /> 家长知情同意</div>
          </div>
          <div class="animal-content">
            <div class="animal">
              <img :src="animals[selectReport.detail?.animal]" alt="">
              <div class="p1">色彩形象</div>
              <div class="p2">{{ selectReport.detail?.animal || 'xx' }}</div>
            </div>
            <div class="grade">
              <h3>色彩心理特征指数</h3>
              <div class="line" v-for="{text, dataIndex} in gradeList" :key="dataIndex">
                <a-popover>
                  <template slot="content">
                    <div class="popover">{{ text[0] }}：</div>
                    <span>{{describe[text[0]]}}</span>
                  </template>
                  <span class="cursor">{{ text[0] }}</span>
                </a-popover>
                <a-slider
                  class="slider"
                  :value="getSliderValue(selectReport, dataIndex)"
                  :min="-10"
                  :max="10"
                  disabled
                  :marks="marks(getSliderValue(selectReport, dataIndex))"
                  :included="false"
                  :tooltipVisible="false"
                />
                <a-popover>
                  <template slot="content">
                    <div class="popover">{{ text[1] }}：</div>
                    <span>{{describe[text[1]]}}</span>
                  </template>
                  <span class="ml cursor">{{ text[1] }}</span>
                </a-popover>
              </div>
            </div>
          </div>
          <div class="text-detail">
            <div class="point" v-for="text, index in textList" :key="index">
              <span class="header">{{ text.text }}</span>
              <div class="content">
                <div class="col">
                  <span class="sub-header">{{ text.title[0] }}：</span>
                  <div class="text">
                    {{ selectReport.detail ? selectReport?.detail[text.dataIndex[0]] : '' }}
                  </div>
                </div>
                <a-divider v-if="index<2" class="divider" type="vertical" :dashed="false"></a-divider>
                <div class="col" v-if="index<2">
                  <span class="sub-header">{{ text.title[1] }}：</span>
                  <div class="text">
                    {{ selectReport.detail ? selectReport.detail[text.dataIndex[0]] : '' }}
                  </div>
                </div>
              </div>
              <div class="suggest">
                <span class="sub-header">建议：</span>
                <div class="text">
                  {{ selectReport.detail ? selectReport.detail[text.dataIndex[text.dataIndex.length-1]] : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
import { resultObject, describe } from './data.js';
import * as animals from '@/assets/characters'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export default {
  components: {
    headerPart,
  },
  data() {
    return {
      studentInfo: {},
      reportList: [],
      animals,
      gradeList: [
        { text: ['内认同', '外认同'], dataIndex: 'rentong' },
        { text: ['理性', '感性'], dataIndex: 'lixing'},
        { text: ['个性', '群体'], dataIndex: 'geti' },
        { text: ['执行', '幻想'], dataIndex: 'zhixing' },
        { text: ['果断', '清晰'], dataIndex: 'guoduan' },
        { text: ['理想', '现实'], dataIndex: 'lixiang' },
      ],
      textList: [
        { text: '个人特质', dataIndex: ['person_1', 'person_2', 'person_3'], title: ['优势', '弱势', '建议'] },
        { text: '学习风格', dataIndex: ['study_1', 'study_2', 'study_3'], title: ['学习特点', '学习重点及技巧', '建议']},
        { text: '沟通方式（父母及老师）', dataIndex: ['communicate_1', 'communicate_2'], title: ['沟通特点', '建议'] },
        { text: '人际关系（同龄朋友）', dataIndex: ['interpersonal_1', 'interpersonal_2' ], title: ['人际情况及特点', '建议'] },
      ],
      selectReport: {},
      describe,
    };
  },
  created() {
  },
  methods: {
    getStudentInfo(info) {
        this.studentInfo = Object.assign({}, info, {known: JSON.parse(info.known || {})});
        this.$axios.studentReport({studentId: info.id}).then((res) => {
          const result = res.sort((a, b) => new Date(Date.parse(b.answer.createTime)) - new Date(Date.parse(a.answer.createTime)));
          this.reportList = result.map(item => ({...item.answer, detail: resultObject[item.answer.characterId], name: item.paper_name})).filter(i=>i.isLast);
          this.selectReport = this.reportList[0] || {};
        })
    },
    getSliderValue(report, dataIndex) {
      const detail = report.detail || {};
      return detail[dataIndex];
    },
    deleteLocal() {
      this.$static.student_id = null;
      localStorage.removeItem('student_id');
      this.$router.push({name: 'studentLogin'});
    },
    html2report() {
      const element = document.getElementById('report');

      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const width = (canvas.width/canvas.height) * 297;
        const height = 297;

        pdf.addImage(imgData, 'PNG', (210-width)/2, 0, width, height);
        pdf.save('个人报告.pdf');
      });
    },
    onClickReport(paper) {
      this.selectReport = paper;
    },
    marks(num) {
      return {
        0: '0',
        10: '+10',
        '-10': '-10',
        [num]: num,
      }
    },
  }
}
</script>

<style lang="less" scoped>
.report-container {
  .content {
    margin-top: 24px;
    display: flex;
    .self-info {
      flex: 0 0 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 48px;
      .remove {
        cursor: pointer;
        border-radius: 12px;
        padding: 2px 12px;
        background-color: #B7B7BC;
        color: #fff;
        margin: 12px 0 64px;
      }
      .title {
        font-size: 32px;
        font-weight: bold;
        margin-top: 12px;
      }
      .detail-info {
        width: 200px;
        text-align: left;
        font-size: 20px;
      }
      .detail-info-before {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #63C5E9;
      }
    }
    .report-detail {
      .first-line {
        display: flex;
        justify-content: space-between;
        .status {
          color: #B5B6C9;
        }
      }
      .head {
        display: flex;
        justify-content: space-between;
        .all-reports {
          display: flex;
          .report-tag {
            cursor: pointer;
            border-radius: 20px;
            background: none;
            border: none;
            padding: 2px 8px;
          }
          .select {
            background-color: #b9ecff;
          }
        }
      }
      .report {
        padding: 24px;
        width: 74vw;
        min-height: 80vh;
        border-radius: 24px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
        .animal-content {
          display: flex;
          .animal {
            border-radius: 24px;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
            margin: 12px 120px 0 12px;
            width: 280px;
            text-align: center;
            img {
              width: 200px;
              height: 200px;
              border-radius: 50%;
            }
            .p1 {
              font-size: 20px;
            }
            .p2 {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 24px;
            }
          }
          .line {
            display: flex;
            align-items: center;
            span {
              width: 50px;
              margin: 0 20px;
            }
            .slider {
              width: 600px;
            }
            /deep/ .ant-slider-disabled .ant-slider-handle {
              border-color: #63C5E9 !important;
              background-color: #63C5E9;
            }
            /deep/ .ant-slider-rail {
              background-color: #e5f8ff !important;
            }
            /deep/ .ant-slider-dot {
              display: none;
            }
          }
        }
        .text-detail {
          text-align: justify;
          .point {
            margin-top: 24px;
            .header {
              font-size: 20px;
              font-weight: bold;
              border-bottom: 4px solid #ebebeb;
            }
            .divider {
              margin: 0 24px;
              position: relative;
              height: 200px;
            }
            .sub-header {
              color: #63C5E9;
            }
            .content {
              display: flex;
              margin-top: 24px;
            }
            .text {
              margin-top: 8px;
              white-space: pre-line;
            }
            .suggest {
              margin-top: 24px;
              background-color: #f9f8f8;
              padding: 12px;
              border-radius: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped>
.popover {
  color: #000;
  font-weight: bold;
}
</style>