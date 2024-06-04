<template>
  <div class="archive-container">
    <h2>心理健康档案库</h2>
    <div>
      <a-breadcrumb>
        <a-breadcrumb-item><router-link to="/school/archive">档案库</router-link></a-breadcrumb-item>
        <a-breadcrumb-item v-if="grade_id"><router-link to="/school/archive">{{ grade_id }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item v-if="class_id"><router-link to="/school/archive">{{ class_id }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item v-if="student_name">{{ student_name }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="detail" v-if="showType">
      <archive-all v-if="showType===1"></archive-all>
      <grade-all v-else-if="showType===2"></grade-all>
      <class-all v-else-if="showType===3"></class-all>
      <student-per v-else-if="showType===4"></student-per>
    </div>
  </div>
</template>

<script>
import archiveAll from './components/archiveAll.vue';
import gradeAll from './components/gradeAll.vue';
import classAll from './components/classAll.vue';
import studentPer from './components/studentPer.vue';
export default {
  components: {
    archiveAll,
    gradeAll,
    classAll,
    studentPer,
  },
  data() {
    return {
      grade_id: this.$route.query.gradeId,
      class_id: this.$route.query.classId,
      student_name: '',
    };
  },
  computed: {
    showType() {
      if (!this.grade_id) {
        return 1;
      } else if (!this.class_id) {
        return 2;
      } else if (!this.student_name) {
        return 3;
      }
      return 4;
    },
  },
  watch: {
    $route(to) {
      this.grade_id = to.query.gradeId;
      this.class_id = to.query.classId;
      this.student_name = to.query.studentName;
    },
  },
}
</script>

<style lang="less" scoped>
.archive-container {
  padding: 24px 48px;
  .detail {
    margin: 48px 0;
  }
}
</style>