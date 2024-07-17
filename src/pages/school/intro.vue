<template>
  <div class="container">
    <h2>我的主页</h2>
    <div class="base-form">
      <div class="logo">
        <img src="@/assets/school/logo.png" alt="avatar" />
        <span class="title">{{ schoolInfo.name }}</span>
      </div>
      <div class="info">
        <a-row>
          <a-col :span="24">
            <div class="spot mr"></div><span>学校 </span><span class="name">{{ schoolInfo.name }}</span>
          </a-col>
          <a-col :span="12">
            <div class="spot mr"></div><span>手机 </span><span class="name">{{ schoolInfo.name }}</span>
          </a-col>
          <a-col :span="12">
            <div class="spot mr"></div><span>邮箱 </span><span class="name">{{ schoolInfo.name }}</span>
          </a-col>
          <a-col :span="12">
            <div class="spot mr"></div><span>账号 </span><span class="name">{{ schoolInfo.id }}</span>
          </a-col>
          <a-col :span="12">
            <div class="spot mr"></div><span>密码 </span><span class="name">{{ schoolInfo.password }}</span>
          </a-col>
        </a-row>
      </div>
      <div class="out">
        <a-tag class="btn" @click="deleteLocal">退出登录</a-tag>
      </div>
    </div>
    <div class="excel-form">
      <h3>年级档案</h3>
      <div class="excel">
        <div class="tips">
          <h3>请分别按照提供的格式上传每个年级的名单表格</h3>
          <div class="model">
            <div><img class="ml" src="@/assets/school/excel.png" alt=""></div>
            <a class="cursor none-a" href="/excel/学生档案信息模板.xlsx"><a-icon type="download"></a-icon> 下载表格模版</a>
          </div>
        </div>
        <a-table
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
        >
          <template slot="action" slot-scope="text, row">
            <a-tag class="upload" @click="importStudentList(row.id)">上传</a-tag>
          </template>
        </a-table>
      </div>
      <!-- <a-button @click="importStudentList">上传</a-button> -->
    </div>
    <a-modal
      class="modal"
      :visible="uploadShow"
      title="导入学生信息"
      :confirm-loading="confirmLoading"
      okText="确认"
      cancelText="取消"
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
import _ from 'lodash';
import * as XLSX from 'xlsx';
import { excelHeaderMap } from './data.js';
const sortList = ['一','二','三','四','五','六','七','八','九','十','十一','十二','往届'];
export default {
  data() {
    return {
      uploadShow: false,
      confirmLoading: false,
      uploadData: [],
      fileList: [],
      schoolId: localStorage.getItem('school_id'),
      schoolInfo: {},
      columns: [
        { key: 'name', dataIndex: 'name', title: '年级', width: 200 },
        { key: 'time', dataIndex: 'time', title: '上传时间' },
        { key: 'action', title: '', scopedSlots: { customRender: 'action' }, width: 100 },
      ],
      dataSource: [
        { id: '一', name: '一年级' },
        { id: '二', name: '二年级' },
        { id: '三', name: '三年级' },
        { id: '四', name: '四年级' },
        { id: '五', name: '五年级' },
        { id: '六', name: '六年级' },
      ],
      grade: '',
    };
  },
  watch: {
    '$store.state.groupStudent'(val) {
      const createTime = {};
      val.forEach((item) => {
        createTime[item.gradeId] = item.createTime;
      });
      this.dataSource = this.dataSource.map(item => ({ ...item, time: createTime[item.id] }));
    },
  },
  created() {
    this.init();
  },
  methods: {
    importStudentList(grade) {
      const that = this;
      this.$confirm({
        content: '本次上传将覆盖已有数据，是否确认上传？',
        okText: '确定',
        cancelText: '取消',
        class: 'modal',
        okButtonProps: {
          style: {
            backgroundColor: '#6C72C9',
            borderColor: '#6C72C9',
          }
        },
        cancelButtonProps: {
          class: 'custom-cancel-button',
        },
        onOk: () => {
          that.uploadShow = true;
          that.uploadData = [];
          that.fileList = [];
          that.grade = grade;
        },
      })
    },
    handleOk() {
      this.confirmLoading = true;
      console.log(this.uploadData)
      this.$axios.schoolUpload({ studentList: this.uploadData, schoolId: this.schoolId }).then(() => {
        this.$message.success('上传成功');
        this.confirmLoading = false;
        this.uploadShow = false;
        this.initList();
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
      console.log(data)
      const processedData = dataArray.map((row) => {
        const rowData = {};
        row.forEach((value, index) => {
          const header = excelHeaderMap.find(i => i.title === headers[index])?.key;
          rowData[header] = value;
        });
        rowData.grade = this.grade;
        return rowData;
      });
      this.uploadData = processedData;
    },
    removeFile() {
      // 处理文件移除操作
      this.uploadData = [];
      this.fileList = [];
    },
    initList() {
      this.$axios.schoolStudentInfo({schoolId: this.schoolId}).then((res) => {
        const originStudentAll = res;
        const groupStudent = _.map(_.groupBy(originStudentAll, 'grade'), (val, key) => {
          return {
            gradeId: key, gradeName: `${key}年级`, createTime: val[0].createTime, children: _.map(_.groupBy(val, 'classNum'), (v, k) => {
              return {
                classId: `${key}-${k}`, className: `${k}班级`, children: v,
              }
            }),
          }
        }).sort((a,b) => sortList.indexOf(a.gradeId) - sortList.indexOf(b.gradeId));
        this.$store.commit('updateGroupStudent', groupStudent);
      });
    },
    init() {
      this.$axios.schoolInfo({schoolId: this.schoolId}).then((res) => {
        this.schoolInfo = res;
      });
    },
    deleteLocal() {
      this.$static.school_id = null;
      localStorage.removeItem('school_id');
      this.$router.push({name: 'schoolLogin'});
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 24px 48px;
  color: #414158;
  h2 {
    font-size: 36px;
  }
  .base-form {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    background-color: #fff;
    border-radius: 12px;
    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 24px 0;
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
    .btn {
        margin: 24px 0;
        background-color: #E2E3F4;
        border-radius: 24px;
        color: #5A5FA7;
        cursor: pointer;
        padding: 2px 8px;
    }
  }
  .excel-form {
    margin-top: 24px;
    .excel {
      padding: 24px;
      background-color: #fff;
      border-radius: 12px;
      .tips {
        display: flex;
        justify-content: space-between;
        h3 {
          font-size: 20px;
          color: #B5B6C9;
        }
      }
      .upload {
        background-color: #6C72C9;
        margin: 4px 0;
        border-radius: 24px;
        color: #fff;
        cursor: pointer;
        padding: 2px 12px;
      }
      /deep/.ant-table-body {
        background-color: #fff;

        .ant-table-thead th {
          background-color: #fff;
          color: #B7B7BC;
        }
      }
    }
  }
}
.modal {
  /deep/ .ant-btn-primary {
    background-color: #6C72C9;
    border-color: #6C72C9;
  }
  /deep/ .ant-btn:hover {
    color: #6C72C9;
    border-color: #6C72C9;
  }
  /deep/ .ant-btn-primary:hover {
    color: #fff;
  }
}
</style>
<style>
.custom-cancel-button:hover {
  color: #6C72C9;
  border-color: #6C72C9;
}
</style>