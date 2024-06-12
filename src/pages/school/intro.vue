<template>
  <div class="container">
    <div class="logo">
      <img src="@/assets/school/header.png" alt="avatar" />
      <span class="title">Little Mood</span>
    </div>
    <div class="base-form">
      <h3>账户信息</h3>
    </div>
    <div class="excel-form">
      <h3>档案库学生信息管理</h3>
      <a-button @click="importStudentList">上传</a-button>
    </div>
    <a-modal
      :visible="uploadShow"
      title="导入学生信息"
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
import { excelHeaderMap } from './data.js';
export default {
  data() {
    return {
      uploadShow: false,
      confirmLoading: false,
      uploadData: [],
      fileList: [],
      schoolId: localStorage.getItem('school_id'),
    };
  },
  methods: {
    importStudentList() {
      this.uploadShow = true;
    },
    handleOk() {
      this.confirmLoading = true;
      console.log(this.uploadData)
      this.$axios.schoolUpload({ studentList: this.uploadData, schoolId: this.schoolId }).then(() => {
        this.$message.success('上传成功');
        this.confirmLoading = false;
        this.uploadShow = false;
      }).catch((err) => {
        this.$message.error(err);
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
      const headers = data[1]; // 获取第二行的字段名
      const dataArray = data.slice(2); // 获取第二行之后的数据
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
  margin: 24px;
}
</style>