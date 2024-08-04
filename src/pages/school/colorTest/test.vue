<template>
  <div class="container">
    <h2>色彩测试</h2>
    <a-breadcrumb>
      <a-breadcrumb-item><router-link to="/school/test">色彩测试</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>新的测试</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="step">
      <img v-if="step>0" src="@/assets/school/step2.png" alt="">
      <img v-else src="@/assets/school/step1.png" alt="">
      <span>第一步</span>
      <div class="backup">
        <div class="process">
          <div class="process-title">知情同意书</div>
          <div>为了尊重保护每一位学生的隐私，在每次测试前，我们需要征集每位家长的知情同意。<br/>右边是我们提供的知情同意书模版，你可以下载。班主任负责发放给每一位家长并统计他们的同意与否。</div>
          <a-divider></a-divider>
          <div class="process-view">
            <span>知情同意情况</span>
            <a-slider class="slider" v-model="processPercent" :min="0" :max="100" disabled />
            <span class="num">{{processPercent}}</span>
            <span class="mr">%</span>
            <a-tag class="btn" @click="importKnow">更新</a-tag>
          </div>
        </div>
        <div class="pdf-all">
          <div class="pdf">
            <img src="@/assets/school/pdf.png" alt="">
            <a class="cursor none-a" href="/excel/知情同意书.pdf" download><a-icon type="download"></a-icon> 下载知情同意书</a>
            <!-- <div @click="downloadPDF">
              <a-icon type="download" />下载知情同意书
            </div> -->
          </div>
          <div class="pdf">
            <img src="@/assets/school/excel2.png" alt="">
            <div @click="getInfo">
              <a-icon type="download" />下载表格模板
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="step step2">
      <img v-if="step>1" src="@/assets/school/step2.png" alt="">
      <img v-else src="@/assets/school/step1.png" alt="">
      <span>第二步</span>
      <div class="backup">
        <div class="txt">
          <div class="title">{{ newTestName }}</div>
          <div>参与人数： {{ num }}</div>
        </div>
        <div>
          <a-button class="btn-school mr" :disabled="processPercent===0" @click="publish('发布')">发布测试</a-button>
          <a-button class="btn-school" @click="publish('结束')">结束测试</a-button>
        </div>
      </div>
    </div>
    <a-modal
      :visible="uploadShow"
      title="导入学生知情情况"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-upload ref="upload" :beforeUpload="beforeUpload" :remove="removeFile" :fileList="fileList">
        <a-button icon="upload" type="primary">点击上传</a-button>
      </a-upload>
    </a-modal>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { excelHeaderMap } from '../data.js';
export default {
  data() {
    return {
      num: '-',
      step: 0,
      processPercent: 0,
      newTestName: this.$route.params.name,
      newTestId: this.$route.params.id,
      uploadShow: false,
      confirmLoading: false,
      uploadData: [],
      fileList: [],
    };
  },
  created() {
    if (!this.newTestId) {
      this.$router.push({path: '/school/test'});
    } else {
      this.init();
    }
  },
  methods: {
    init() {
      this.$axios.schoolGetPapers({testId: this.newTestId}).then((res) => {
        if (res.length) {
          const { studentNum = 0, knowPercent = 0, ifRelease, finishTime } = res.find(i => i.id === this.newTestId);
          this.num = studentNum;
          this.processPercent = Number((knowPercent*100).toFixed(2));
          if (knowPercent) {
            this.step ++;
          }
          if (ifRelease || finishTime) {
            this.step ++;
          }
        }
      });
    },
    // downloadPDF() {
    //   const pdfUrl = '/school-server/know.word';
    //   const link = document.createElement('a');
    //   link.href = pdfUrl;
    //   link.download = '家长知情同意书.word'; // 可以自定义下载的文件名
    //   link.click();
    // },
    getInfo() {
      this.$axios.schoolStudentInfo({schoolId: localStorage.getItem('school_id')}).then(res => {
        const studentsInfo = res.map(item => ({
          '学籍号': item.cardId,
          '学号': item.classId,
          '姓名': item.name,
          '年级': item.grade,
          '班级': item.classNum,
          '家长知情同意（是/否）': undefined,
        }));
        const worksheet = XLSX.utils.json_to_sheet(studentsInfo);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, `学生列表.xlsx`);
      });
    },
    importKnow() {
      this.uploadShow = true;
      this.uploadData = [];
      this.fileList = [];
    },
    handleOk() {
      this.confirmLoading = true;
      const params = this.uploadData.map(item => ({cardId: item.cardId, known: item.known || '否', testId: this.newTestId}));
      this.$axios.schoolUploadKnown(params).then((res) => {
        const {successNum, percent} = res;
        this.processPercent = Number((percent*100).toFixed(2));
        this.num = successNum;
        this.$message.success('更新成功');
        this.confirmLoading = false;
        this.uploadShow = false;
        this.step = this.step ? this.step : 1;
      }).catch(() => {
        this.$message.error("数据上传失败，请检查表格内容后重试!使用问题请对照使用说明或联系团队!");
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.uploadData = [];
      this.uploadShow = false;
      this.fileList = [];
    },
    beforeUpload(file) {
      this.uploadData = [];
      this.fileList = [];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.getExcelData(jsonData);
        this.fileList = [file];
      };
      reader.readAsArrayBuffer(file);
      return false;
    },
    getExcelData(data) {
      const headers = data[0]; // 获取第一行的字段名
      const dataArray = data.slice(1); // 获取第一行之后的数据
      const processedData = dataArray.map((row) => {
        const rowData = {};
        row.forEach((value, index) => {
          const header = excelHeaderMap.find(i => i.title === headers[index])?.key;
          rowData[header] = value;
        });
        return rowData;
      });
      this.uploadData = processedData;
    },
    removeFile() {
      // 处理文件移除操作
      this.uploadData = [];
      this.fileList = [];
    },
    // 发布/结束测试
    publish(type) {
      this.$axios.schoolPublishPaper({testId: this.newTestId, type: type}).then(() => {
        this.$message.success('更新成功');
        this.step = 2;
      });
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  margin: 36px;
  h2 {
    font-size: 36px;
  }
  /deep/ .ant-slider-disabled .ant-slider-handle {
    border-color: #6C72C9 !important;
    background-color: #6C72C9;
  }
  /deep/ .ant-slider-track {
    background-color: #6C72C9 !important;
  }
  .step {
    margin-top: 24px;
  }
  .backup {
    background-color: #fff;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36px;
    margin: 12px 0;
    .pdf-all {
      display: flex;
      gap: 24px;
    }
    .pdf {
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        cursor: pointer;
      }
    }
    .process-title {
      font-size: 20px;
      color: #B5B6C9;
      margin-bottom: 12px;
    }
    .process-view {
      display: flex;
      align-items: center;
      .slider {
        width: 600px;
        margin: 0 12px;
      }
      .btn {
          margin: 24px 0;
          background-color: #E2E3F4;
          border-radius: 24px;
          color: #5A5FA7;
          cursor: pointer;
          padding: 2px 8px;
      }
      .num {
        color: #16161D;
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
  .step2 {
    .txt {
      .title {
        font-size: 36px;
        color: #6C72C9;
        font-weight: bold;
      }
    }
  }
}
</style>