<template>
  <div>
    <div class="base-info">
      <h2>学生档案</h2>
      <div class="base-form">
        <div class="avatar">
          <img src="@/assets/school/header.png" alt="avatar" />
        </div>
        <div class="info">
          <a-row>
            <a-col :span="24">
              <div class="student-name">{{ baseInfo.name }}</div>
            </a-col>
            <a-col :span="8">
              <div class="spot mr"></div><span>学号 </span><span class="name">{{ baseInfo.classId }}</span>
            </a-col>
            <a-col :span="8">
              <div class="spot mr"></div><span>性别 </span><span class="name">{{ baseInfo.sex }}</span>
            </a-col>
            <a-col :span="8">
              <div class="spot mr"></div><span>地区 </span><span class="name">{{ baseInfo.province }}</span>
            </a-col>
          </a-row>
        </div>
        <div class="parent"><a-icon :type="baseInfo.known ? 'check-circle' : 'close-circle'" theme="twoTone" /> 家长知情同意</div>
      </div>
    </div>
    <div class="report-list">
      <div class="head">
        <h2>分析报告</h2>
        <div class="all-reports">
          <div v-for="report,index in reportList" :key="index">
            <a-tag :class="{'report': true, 'select': !!(selectReport.paperId === report.paperId)}" @click="onClickReport(report)">{{ report.name }}</a-tag>
          </div>
        </div>
      </div>
      <div class="background">
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
</template>

<script>
import { resultObject, describe } from '@/pages/student/data.js';
import * as animals from '@/assets/characterIcon'
export default {
  data() {
    return {
      studentId: this.$route.query.studentId,
      baseInfo: {},
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
      reportList: [],
      selectReport: {},
      describe,
    };
  },
  created() {
    this.getStudentInfo();
  },
  methods: {
    getStudentInfo() {
      this.$axios.schoolStudentInfo({studentId: this.studentId}).then((res) => {
        if(res.length) {
          this.baseInfo = res[0];
        }
      });
      this.$axios.studentReport({studentId: this.studentId}).then((res) => {
        const result = res.sort((a, b) => new Date(Date.parse(b.answer.createTime)) - new Date(Date.parse(a.answer.createTime)));
        this.reportList = result.map(item => ({...item.answer, detail: resultObject[item.answer.characterId], name: item.paper_name})).filter(i=>i.isLast);
        this.selectReport = this.reportList[0] || {};
      });
    },
    getSliderValue(report, dataIndex) {
      const detail = report.detail || {};
      return detail[dataIndex];
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
  },
}
</script>

<style lang="less" scoped>
.background {
  background-color: #fff;
  padding: 48px;
  border-radius: 24px;
  min-height: 70vh;
  // overflow-y: auto;
}
.base-info {
  margin-top: 24px;
  .base-form {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border-radius: 12px;
    height: 140px;
    .student-name {
      font-size: 20px;
      font-weight: bold;
    }
    .info {
      width: 1000px;
      margin: 64px 0;
      .spot {
        display: inline-block;
        background-color: #CED0ED;
        border-radius: 50%;
        width: 12px;
        height: 12px;
      }
      span {
        font-size: 20px;
        line-height: 170%
      }
    }
  }
}
.report-list {
  margin-top: 48px;
  .head {
    display: flex;
    justify-content: space-between;
    .all-reports {
      display: flex;
      .report {
        cursor: pointer;
        border-radius: 20px;
        background: none;
        border: none;
        padding: 2px 8px;
      }
      .select {
        background-color: #e7e7f3;
      }
    }
  }
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
        border-color: #6C72C9 !important;
        background-color: #6C72C9;
      }
      /deep/ .ant-slider-rail {
        background-color: #E2E3F4 !important;
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
        color: #8489D2;
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
</style>
<style scoped>
.popover {
  color: #000;
  font-weight: bold;
}
</style>