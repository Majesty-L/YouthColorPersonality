<template>
  <div>
    <div class="table-container">
      <a-table :columns="columns" :data-source="dataSource" :pagination="false" :row-key="record => record.id"
        :loading="loading" :customRow="customRow">
      </a-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data() {
    return {
      columns: [
        { title: '评分', dataIndex: 'classId', key: 'classId' },
        { title: '反馈', dataIndex: 'cardId', key: 'cardId' },
        { title: '时间', dataIndex: 'name', key: 'name' },
      ],
      loading: false,
      gradeList: [
        { key: '一', title: '一年级' },
        { key: '二', title: '二年级' },
        { key: '三', title: '三年级' },
        { key: '四', title: '四年级' },
        { key: '五', title: '五年级' },
        { key: '六', title: '六年级' },
      ],
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
  },
}
</script>

<style lang="less" scoped>
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
</style>