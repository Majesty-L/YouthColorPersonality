<template>
  <div>
    <div class="base-info">
      <h2>学生档案</h2>
      <div class="background">
        <div class="avatar">
          <img src="@/assets/school/header.png" alt="avatar" />
        </div>
        <div class="info">
          <div class="name">{{ baseInfo.name }}</div>
          <div class="">学号：{{ baseInfo.classId }}</div>
          <div class="">性别：{{ baseInfo.sex }}</div>
          <div class="">地区：{{ baseInfo.province }}</div>
          <div class="parent">家长知情同意 <a-icon :type="baseInfo.known ? 'check-circle' : 'close-circle'" theme="twoTone" /></div>
        </div>
      </div>
    </div>
    <div class="report-list">
      <h2>分析报告</h2>
      <div class="background">
        <div v-for="(perReport, index) in reportList" :key="index" class="report">
          <div class="animal-content">
            <img :src="animals[perReport.detail?.animal]" alt="">
            <div class="grade">
              <h3>色彩心理特征指数</h3>
              <div class="line" v-for="{text, dataIndex} in gradeList" :key="dataIndex">
                <span>{{ text[0] }}</span>
                <a-slider
                  class="slider"
                  range
                  :value="[getSliderValue(perReport, dataIndex), getSliderValue(perReport, dataIndex)]"
                  :min="-10"
                  :max="10"
                  disabled
                />
                <span>{{ text[1] }}</span>
              </div>
            </div>
          </div>
          <div class="text-detail">
            <div class="point" v-for="text, index in textList" :key="index">
              <h3>{{ text.text }}</h3>
              <div class="text">
                {{ perReport.detail[text.dataIndex] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resultObject } from '@/pages/student/data.js';
import * as animals from '@/assets/characters'
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
      ],
      textList: [
        { text: '个人特质', dataIndex: 'person' },
        { text: '学习风格', dataIndex: 'study'},
        { text: '沟通方式（父母及老师）', dataIndex: 'communicate' },
        { text: '人际关系（同龄朋友）', dataIndex: 'interpersonal' },
      ],
      reportList: [],
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
      }).catch(() => [

      ]);
      this.$axios.studentReport({studentId: this.studentId}).then((res) => {
        const result = res.sort((a, b) => new Date(Date.parse(b.createTime)) - new Date(Date.parse(a.createTime)));
        this.reportList = result.map(item => ({...item, detail: resultObject[item.characterId]})).slice(0,1);
      }).catch(() => [
        
      ]);
    },
    getSliderValue(report, dataIndex) {
      const detail = report.detail || {};
      return detail[dataIndex];
    },
  },
}
</script>

<style lang="less" scoped>
.background {
  background-color: #fff;
  padding: 48px;
  border-radius: 24px;
  max-height: 70vh;
  overflow-y: auto;
}
.base-info {
  margin-top: 24px;
}
.report-list {
  margin-top: 48px;
  .animal-content {
    display: flex;
    .line {
      display: flex;
      span {
        width: 50px;
      }
      .slider {
        width: 500px;
      }
    }
  }
  .text-detail {
    .point {
      margin-top: 24px;
      .text {
        white-space: pre-wrap;
      }
    }
  }
}
</style>