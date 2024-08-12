<template>
  <div>
    <div class="level">
      <div class="level-left">
        <h3>班级档案</h3>
      </div>
      <div class="level-right"><a-tag class="btn open" @click="onClickAdd">+ 添加学生</a-tag></div>
    </div>
    <div class="table-container">
      <a-table :columns="columns" :data-source="dataSource" :pagination="false" :row-key="record => record.id"
        :loading="loading" :customRow="customRow">
        <template slot="needSafe" slot-scope="text">
          <img v-if="text" src="@/assets/school/safe.png" alt="">
        </template>
        <template slot="action" slot-scope="text, row">
          <a-tag class="btn" @click.native.stop="changeStudentInfo(row)">修改</a-tag>
        </template>
      </a-table>
    </div>
    <a-modal class="modal" :visible="changeVisible" @ok="handleOk" @cancel="handleCancel">
      <div slot="title" class="title">修改档案信息</div>
      <div slot="footer" class="footer">
        <a-button key="back" :loading="loadingDelete" @click="handleDelete">
          删除档案
        </a-button>
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">
          保存修改
        </a-button>
      </div>
      <a-form-model class="form" layout="horizontal" :model="changeForm">
        <a-form-model-item label="姓名">
          <a-input v-model="changeForm.name" placeholder="姓名">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="年级">
          <a-select v-model="changeForm.grade" placeholder="年级" :options="gradeList">
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="班级">
          <a-input v-model="changeForm.classNum" placeholder="班级"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal class="modal" :visible="addVisible" @cancel="addVisible=false">
      <div slot="title" class="title">新增档案信息</div>
      <div slot="footer" class="footer">
        <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleAddOk">
          确定
        </a-button>
      </div>
      <a-form-model class="form" layout="horizontal" :model="addForm">
        <a-form-model-item label="学籍号">
          <a-input v-model="addForm.cardId" placeholder="学籍号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="学号">
          <a-input v-model="addForm.classId" placeholder="学号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="姓名">
          <a-input v-model="addForm.name" placeholder="姓名">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="性别">
          <a-radio-group v-model="addForm.sex">
            <a-radio value="男">男</a-radio>
            <a-radio value="女">女</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="年龄">
          <a-input-number v-model="addForm.age" placeholder="年龄"></a-input-number>
        </a-form-model-item>
        <a-form-model-item label="地区">
          <a-input v-model="addForm.province" placeholder="地区"></a-input>
        </a-form-model-item>
        <a-form-model-item label="民族">
          <a-input v-model="addForm.nation" placeholder="民族"></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input v-model="addForm.phone" placeholder="手机号"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data() {
    return {
      columns: [
        { title: '学号', dataIndex: 'classId', key: 'classId' },
        { title: '学籍号', dataIndex: 'cardId', key: 'cardId' },
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '性别', dataIndex: 'sex', key: 'sex' },
        { title: '年龄', dataIndex: 'age', key: 'age' },
        { title: '地区', dataIndex: 'province', key: 'province' },
        { title: '动物形象', dataIndex: 'animal', key: 'animal' },
        { title: '开放度', dataIndex: 'open', key: 'open' },
        { title: '多点关爱', dataIndex: 'needSafe', key: 'needSafe', scopedSlots: { customRender: 'needSafe' }, width: 400 },
        { title: '', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' }, width: 40 },
      ],
      loading: false,
      grade_id: this.$route.query.gradeId,
      class_id: this.$route.query.classId,
      changeVisible: false,
      confirmLoading: false,
      changeForm: {},
      gradeList: [
        { key: '一', title: '一年级' },
        { key: '二', title: '二年级' },
        { key: '三', title: '三年级' },
        { key: '四', title: '四年级' },
        { key: '五', title: '五年级' },
        { key: '六', title: '六年级' },
      ],
      editRow: {},
      loadingDelete: false,
      schoolId: this.$static.school_id,
      addForm: {},
      addVisible: false,
    };
  },
  computed: {
    dataSource() {
      const thisGrade = (this.$store.state.groupStudent || []).find(item => item.gradeId === this.grade_id)?.children || [];
      const thisClass = thisGrade.find(item => item.classId === this.class_id)?.children || [];
      return thisClass;
    },
  },
  created() {
  },
  methods: {
    customRow(record) {
      return {
        style: {
          cursor: 'pointer',
        },
        on: {
          click: () => {
            this.$router.push({ path: `/school/archive?gradeId=${this.grade_id}&classId=${this.class_id}&studentId=${record.id}` });
          },
        },
      }
    },
    changeStudentInfo(row) {
      this.editRow = row;
      this.changeForm = {
        name: row.name,
        grade: row.grade,
        classNum: row.classNum,
      }
      this.changeVisible = true;
    },
    handleOk() {
      this.confirmLoading = true;
      this.$axios.modifyStudentInfo({ ...this.changeForm, id: this.editRow.id }).then(() => {
        this.$message.success('修改成功');
        this.initList();
        this.confirmLoading = false;
        this.changeVisible = false;
      }).catch((err) => {
        this.$message.error(err);
        this.confirmLoading = false;
      });
    },
    initList() {
      this.$axios.schoolStudentInfo({ schoolId: this.schoolId }).then((res) => {
        const originStudentAll = res;
        const groupStudent = _.map(_.groupBy(originStudentAll, 'grade'), (val, key) => {
          return {
            gradeId: key, gradeName: `${key}年级`, children: _.map(_.groupBy(val, 'classNum'), (v, k) => {
              return {
                classId: `${key}-${k}`, className: `${k}班级`, children: v,
              }
            }),
          }
        });
        this.archiveList = groupStudent;
        this.$store.commit('updateGroupStudent', this.archiveList);
      });
    },
    handleCancel() {
      this.changeVisible = false;
    },
    handleDelete() {
      this.loadingDelete = true;
      this.$axios.modifyStudentInfo({id: this.editRow.id, delete: true}).then(() => {
        this.$message.success('删除成功');
        this.initList();
        this.loadingDelete = false;
        this.changeVisible = false;
      }).catch((err) => {
        this.$message.error(err);
        this.loadingDelete = false;
      });
    },
    handleAddOk() {
      this.confirmLoading = true;
      this.$axios.modifyStudentInfo({...this.addForm, grade: this.grade_id, classNum: this.class_id?.replace(`${this.grade_id}-`, ''), schoolId: this.schoolId}).then(() => {
        this.$message.success('新增成功');
        this.initList();
        this.confirmLoading = false;
        this.addVisible = false;
      }).catch((err) => {
        this.$message.error(err);
        this.confirmLoading = false;
      });
    },
    onClickAdd() {
      this.addVisible = true;
    },
  },
}
</script>

<style lang="less" scoped>
.level {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.table-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 0 12px;

  /deep/.ant-table-body {
    background-color: #fff;

    .ant-table-thead th {
      background-color: #fff;
      color: #B7B7BC;
    }
  }
}

.btn {
  padding: 0 8px;
  background-color: #E2E3F4;
  border-radius: 24px;
  color: #5A5FA7;
  cursor: pointer;
}

.open {
  padding: 2px 8px;
}

.modal {
  .title {
    text-align: center;
  }

  .footer {
    display: flex;
    justify-content: center;
    gap: 24px;
  }

  .form {
    /deep/.ant-form-item {
      display: flex;
    }

    /deep/.ant-form-item-label {
      flex: 0 0 125px;
    }
    /deep/.ant-select, .ant-input, /deep/.ant-select-selection {
      min-width: 200px;
      border-radius: 20px;
    }
  }
  /deep/ .ant-btn-primary {
    background-color: #6C72C9;
    border-color: #6C72C9;
    border-radius: 20px;
  }
  /deep/ .ant-btn:hover {
    color: #6C72C9;
    border-color: #6C72C9;
  }
  /deep/ .ant-btn {
    border-radius: 20px;
  }
  /deep/ .ant-btn-primary:hover {
    color: #fff;
  }
}
</style>