<template>
  <div class="archive-container">
    <h2>档案库</h2>
    <div>
      <a-breadcrumb>
        <a-breadcrumb-item v-if="grade_id"><router-link to="/school/archive">档案库</router-link></a-breadcrumb-item>
        <a-breadcrumb-item v-if="grade_id"><router-link :to="`/school/archive?gradeId=${grade_id}`">{{ `${grade_id}年级` }}</router-link></a-breadcrumb-item>
        <a-breadcrumb-item v-if="class_id"><router-link :to="`/school/archive?gradeId=${grade_id}&classId=${class_id}`">{{ `${class_id}班级` }}</router-link></a-breadcrumb-item>
        <!-- <a-breadcrumb-item v-if="student_id">{{ student_id }}</a-breadcrumb-item> -->
      </a-breadcrumb>
    </div>
    <div class="detail" v-if="showType">
      <archive-all v-if="showType===1"></archive-all>
      <grade-all v-else-if="showType===2" :key="grade_id"></grade-all>
      <class-all v-else-if="showType===3" :key="class_id"></class-all>
      <student-per v-else-if="showType===4" :key="student_id"></student-per>
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
      grade_id: '',
      class_id: '',
      student_id: '',
    };
  },
  computed: {
    showType() {
      if (!this.grade_id) {
        return 1;
      } else if (!this.class_id) {
        return 2;
      } else if (!this.student_id) {
        return 3;
      }
      return 4;
    },
  },
  watch: {
    $route: {
      handler(to) {
        this.grade_id = to.query.gradeId;
        this.class_id = to.query.classId;
        this.student_id = to.query.studentId;
      },
      immediate: true,
    }
  },
}
</script>

<style lang="less" scoped>
.archive-container {
  padding: 24px 48px;
  .detail {
    margin: 24px 0;
  }
  h2 {
    font-size: 36px;
  }
}
</style>