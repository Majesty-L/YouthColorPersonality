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
        <h2>我的报告</h2>
        <div v-for="(perReport, index) in reportList" :key="index" class="report">
          <div class="first-line">
            <div class="status">最近，我的状态是</div>
            <div class="parent"><a-icon :type="(studentInfo.known && studentInfo.known[perReport.paperId] === '是') ? 'check-circle' : 'close-circle'" theme="twoTone" /> 家长知情同意</div>
          </div>
          <div class="animal-content">
            <div class="animal">
              <img :src="animals[perReport.detail?.animal]" alt="">
              <div class="p1">色彩形象</div>
              <div class="p2">{{ perReport.detail?.animal || 'xx' }}</div>
            </div>
            <div class="grade">
              <h3>色彩心理特征指数</h3>
              <div class="line" v-for="{text, dataIndex} in gradeList" :key="dataIndex">
                <span>{{ text[0] }}</span>
                <a-slider
                  class="slider"
                  :value="getSliderValue(perReport, dataIndex)"
                  :min="-10"
                  :max="10"
                  disabled
                  :included="false"
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
        this.studentInfo = Object.assign({}, info, {known: JSON.parse(info.known || {})});
        this.$axios.studentReport({studentId: info.id}).then((res) => {
          const result = res.sort((a, b) => new Date(Date.parse(b.createTime)) - new Date(Date.parse(a.createTime)));
          this.reportList = result.map(item => ({...item, detail: resultObject[item.characterId]})).slice(0,1);
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
            margin: 12px 48px 0 12px;
            width: 240px;
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