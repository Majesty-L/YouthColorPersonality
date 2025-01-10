<template>
  <div class="report-detail">
    <div class="head">
      <div class="flex">
        <h2 v-html="addPinyin('性格报告')"></h2>
        <!-- <div class="cursor" @click="html2report"><img src="@/assets/school/pdfIcon.png" alt="">下载PDF报告</div> -->
        <div class="all-reports">
          <div v-for="report,index in reportList" :key="index">
            <a-tag :class="{'report-tag': true, 'select': !!(selectReport.createTime === report.createTime)}" @click="onClickReport(report)">{{ report.name }}</a-tag>
          </div>
        </div>
    </div>
    </div>
    <div id="report" class="report" v-if="reportList.length">
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
            <a-divider v-if="index<2" class="divider" :type="windowWidth<500?'horizontal':'vertical'" :dashed="false"></a-divider>
            <div class="col" v-if="index<2">
              <span class="sub-header">{{ text.title[1] }}：</span>
              <div class="text">
                {{ selectReport.detail ? selectReport.detail[text.dataIndex[1]] : '' }}
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
    <div class="report" v-else>
      暂无报告
    </div>
  </div>
</template>

<script>
import { resultObject, describe } from '../data.js';
import * as animals from '@/assets/characterIcon'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { html } from 'pinyin-pro';
export default {
  components: {
  },
  data() {
    return {
      addPinyin: html,
      studentInfo: {},
      reportList: [],
      animals,
      gradeList: [
        { text: ['内认同', '外认同'], dataIndex: 'rentong' },
        { text: ['理性', '感性'], dataIndex: 'lixing'},
        { text: ['个性', '群体'], dataIndex: 'geti' },
        { text: ['执行', '幻想'], dataIndex: 'zhixing' },
        { text: ['果断', '清晰'], dataIndex: 'guoduan' },
        { text: ['现实', '理想'], dataIndex: 'xianshi' },
      ],
      textList: [
        { text: '个人特质', dataIndex: ['person_1', 'person_2', 'person_3'], title: ['优势', '弱势', '建议'] },
        { text: '学习风格', dataIndex: ['study_1', 'study_2', 'study_3'], title: ['学习特点', '学习重点及技巧', '建议']},
        { text: '沟通方式（父母及老师）', dataIndex: ['communicate_1', 'communicate_2'], title: ['沟通特点', '建议'] },
        { text: '人际关系（同龄朋友）', dataIndex: ['interpersonal_1', 'interpersonal_2' ], title: ['人际情况及特点', '建议'] },
      ],
      selectReport: {},
      describe,
      person_id: this.$static.person_id,
      windowWidth: window.innerWidth,
    };
  },
  created() {
    this.getPersonInfo();
  },
  methods: {
    getPersonInfo() {
        this.$axios.personReport({personId: this.person_id}).then((res) => {
          const result = res.sort((a, b) => new Date(Date.parse(b.createTime)) - new Date(Date.parse(a.createTime)));
          this.reportList = result.map(item => ({...item, detail: resultObject[item.characterId], name: item.createTime.split(' ')[0]}));
          this.selectReport = this.reportList[0] || {};
        })
    },
    getSliderValue(report, dataIndex) {
      const detail = report.detail || {};
      return detail[dataIndex];
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
@test-theme-color-person: #00D9C0;
.report-detail {
  .head {
    display: flex;
    justify-content: space-between;
    .flex {
      display: flex;
      gap: 1.5rem;
    }
    .all-reports {
      display: flex;
      align-items: center;
      overflow-y: auto;
      max-width: 70vw;
      .report-tag {
        cursor: pointer;
        border-radius: 1.2rem;
        background: none;
        border: none;
        padding: 0.1rem 0.5rem;
      }
      .select {
        background-color: #b9ecff;
      }
    }
  }
  .report {
    padding: 4rem;
    width: 78vw;
    min-height: 80vh;
    border-radius: 24px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
    .animal-content {
      display: flex;
      justify-content: space-between;
      .animal {
        flex: 0 1 30%;
        padding-top: 1.5rem;
        border-radius: 24px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
        text-align: center;
        img {
          max-height: 100%;
          border-radius: 50%;
        }
        .p1 {
          font-size: 1.2rem;
        }
        .p2 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
      }
      .grade {
        flex: 0 1 60%;
        .line {
          display: flex;
          align-items: center;
          span {
            flex: 0 1 4rem;
          }
          span:nth-of-type(2) {
            margin-left: 2rem;
          }
          .slider {
            width: 30vw;
          }
          /deep/ .ant-slider-disabled .ant-slider-handle {
            border-color: @test-theme-color-person !important;
            background-color: @test-theme-color-person;
          }
          /deep/ .ant-slider-rail {
            background-color: #e5f8ff !important;
          }
          /deep/ .ant-slider-dot {
            display: none;
          }
        }
      }
    }
    .text-detail {
      text-align: justify;
      .point {
        margin-top: 1.5rem;
        .header {
          font-size: 1.2rem;
          font-weight: bold;
          border-bottom: 4px solid #ebebeb;
        }
        .divider {
          margin: 0 1.5rem;
          position: relative;
          height: 12rem;
        }
        .sub-header {
          color: @test-theme-color-person;
        }
        .content {
          display: flex;
          margin-top: 1.5rem;
        }
        .text {
          margin-top: 0.5rem;
          white-space: pre-line;
        }
        .suggest {
          margin-top: 1.5rem;
          background-color: #f9f8f8;
          padding: 0.8rem;
          border-radius: 0.8rem;
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
<style lang="less" scoped>
@media (max-width: 1200px) {
.report-detail {
  .head {
    .flex {
      gap: 1rem;
    }
  }
  .report {
    padding: 2rem;
    .animal-content {
      gap: 1.6rem;
      .animal {
        .p1 {
          font-size: 1rem;
        }
        .p2 {
          font-size: 1.6rem;
          margin-bottom: 1rem;
        }
      }
    }
  }
}
}
</style>
<style lang="less" scoped>
@media (max-width: 800px) {
.report-detail {
  .head {
    margin: 0 2rem;
    .flex {
      gap: 1rem;
    }
    .all-reports {
    }
  }
  .report {
    border: none;
    box-shadow: none;
    width: 100vw;
    .animal-content {
      flex-wrap: wrap;
      gap: 1.6rem;
      justify-content: center;
      .animal {
        flex: 0 1 45%;
        .p1 {
          font-size: 1rem;
        }
        .p2 {
          font-size: 1.6rem;
          margin-bottom: 1rem;
        }
      }
      .grade {
        h3 {
          display: inline-block;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          border-bottom: 4px solid #ebebeb;
        }
        .line {
          span {
            flex: 0 1 6rem;
          }
          span:nth-of-type(2) {
            text-align: right;
          }
          .slider {
            width: 80vw;
          }
        }
      }
    }
  }
}
}
</style>
<style lang="less" scoped>
@media (max-width: 500px) {
.report-detail {
  .head {
    margin: 0 1rem;
    .flex {
      justify-content: space-between;
    }
    .all-reports {
      flex: 0 1 60vw;
      .report-tag {
        border-radius: 1.2rem;
        padding: 0.1rem 0.4rem;
      }
    }
    h2 {
      flex: 1 0 24vw;
    }
  }
  .report {
    .animal-content {
      gap: 1.6rem;
      .animal {
        flex: 0 1 45%;
        .p1 {
          font-size: 0.8rem;
        }
        .p2 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        img {
          max-width: 12rem;
        }
      }
      .grade {
        max-width: 100%;
        h3 {
          display: inline-block;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
          border-bottom: 4px solid #ebebeb;
        }
        .line {
          span {
            flex: 0 1 4rem;
          }
          span:nth-of-type(2) {
            margin-left: 1rem;
          }
          span:nth-of-type(2) {
            text-align: right;
          }
          .slider {
            width: 80vw;
          }
        }
      }
    }
    .text-detail {
      .point {
        .header {
        }
        .divider {
          margin: 1rem 0;
          width: 100%;
          height: 1px;
        }
        .sub-header {
        }
        .content {
          flex-wrap: wrap;
        }
        .text {
        }
        .suggest {
          margin: 1.5rem -2rem;
          padding: 0.8rem 2rem;
          border-radius: 0;
        }
      }
    }
  }
}
}
</style>