<template>
  <div class="report-container">
    <headerPart :type="2" @getStudentInfo="getStudentInfo"></headerPart>
    <div class="content">
      <div class="self-info">
        <img src="@/assets/school/header.png" alt="avatar" />
        <div class="title">{{ studentInfo.name }}</div>
        <div class="">学号：{{ studentInfo.classId }}</div>
        <div class="">性别：{{ studentInfo.sex }}</div>
        <div class="">地区：{{ studentInfo.province }}</div>
        <div class="parent">家长知情同意 <a-icon :type="(studentInfo.known && JSON.parse(studentInfo.known)[reportList[0].id]) ? 'check-circle' : 'close-circle'" theme="twoTone" /></div>
        <div class="">家长知情同意</div>
      </div>
      <div class="report-detail">
        <h2>我的报告</h2>
        <div v-for="(perReport, index) in reportList" :key="index" class="report">
          <div class="">最近，我的状态是</div>
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
import headerPart from './components/headerPart.vue';
import { resultObject } from './data.js';
import * as animals from '@/assets/characters'
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
      ],
      textList: [
        { text: '个人特质', dataIndex: 'person' },
        { text: '学习风格', dataIndex: 'study'},
        { text: '沟通方式（父母及老师）', dataIndex: 'communicate' },
        { text: '人际关系（同龄朋友）', dataIndex: 'interpersonal' },
      ],
    };
  },
  created() {
  },
  methods: {
    getStudentInfo(info) {
        this.studentInfo = info;
        this.$axios.studentReport({studentId: info.id}).then((res) => {
          const result = res.sort((a, b) => new Date(Date.parse(b.createTime)) - new Date(Date.parse(a.createTime)));
          this.reportList = result.map(item => ({...item, detail: resultObject[item.characterId]})).slice(0,1);
        })
    },
    getSliderValue(report, dataIndex) {
      const detail = report.detail || {};
      return detail[dataIndex];
    },
  }
}
</script>

<style lang="less" scoped>
.report-container {
  .content {
    display: flex;
    .self-info {
      flex: 0 0 25%;
    }
    .report-detail {
      .report {
        padding: 24px;
        width: 74vw;
        min-height: 80vh;
        border-radius: 24px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
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
    }
  }
}
</style>