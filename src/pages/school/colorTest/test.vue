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
          <div>知情同意书</div>
          <div>为了尊重保护每一位学生的隐私，在每次测试前，我们需要征集每位家长的知情同意。<br/>右边是我们提供的知情同意书模版，你可以下载。班主任负责发放给每一位家长并统计他们的同意与否。</div>
          <a-divider></a-divider>
          <div class="process-view">
            <span>进度统计</span>
            <a-slider class="slider" v-model="processNum" :min="0" :max="100" disabled />
            <span class="mr">{{processNum}}%</span>
            <a-tag @click="getInfo">下载</a-tag>
            <a-tag @click="importKnow">更新</a-tag>
          </div>
        </div>
        <div class="pdf">
          <img src="@/assets/school/pdf.png" alt="">
          <div @click="downloadPDF">
            <a-icon type="download" />下载知情同意书
          </div>
        </div>
      </div>
    </div>
    <div class="step">
      <img v-if="step>1" src="@/assets/school/step2.png" alt="">
      <img v-else src="@/assets/school/step1.png" alt="">
      <span>第二步</span>
      <div class="backup">
        <div class="txt">
          <div>{{ newTestName }}</div>
          <div>参与人数： {{ num }}</div>
        </div>
        <div class="btn"><a-button>发布测试</a-button></div>
      </div>
    </div>
    <div class="fixed">
      <a-button>结束测试</a-button>
      <a-button>更新状态</a-button>
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
      num: 1,
      step: 0,
      processNum: 0,
      newTestName: this.$route.query.name,
      uploadShow: false,
      confirmLoading: false,
      uploadData: [],
      fileList: [],
    };
  },
  methods: {
    downloadPDF() {
      const pdfUrl = '/school-server/know.word';
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = '家长知情同意书.word'; // 可以自定义下载的文件名
      link.click();
    },
    getInfo() {
      this.$axios.schoolStudentInfo({schoolId: localStorage.getItem('school_id')}).then(res => {
        const studentsInfo = res.map(item => ({
          '学籍号': item.cardId,
          '学号': item.classId,
          '姓名': item.name,
          '年级': item.grade,
          '班级': item.classNum,
          '家长知情同意（是/否）': item.xx,
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
    },
    handleOk() {
      this.confirmLoading = true;
      console.log(this.uploadData)
      // const params = this.uploadData.map(item => ({cardId: item.cardId, known: item.known}));
      // this.$axios.schoolUpload({ studentList: this.uploadData, schoolId: this.schoolId }).then(() => {
      //   this.$message.success('上传成功');
      //   this.confirmLoading = false;
      //   this.uploadShow = false;
      // }).catch((err) => {
      //   this.$message.error(err);
      //   this.confirmLoading = false;
      // });
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
  },
}
</script>

<style lang="less" scoped>
.container {
  margin: 36px;
  .backup {
    background-color: #fff;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 36px;
    margin: 12px 0;
    .pdf {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }
    .process-view {
      display: flex;
      align-items: center;
      .slider {
        width: 600px;
        margin: 0 12px;
      }
    }
  }
  .fixed {
    position: absolute;
    bottom: 24px;
    margin: 0 0 0 40%;
  }
}
</style>