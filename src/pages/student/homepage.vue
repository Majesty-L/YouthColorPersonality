<template>
  <div class="home-container">
    <headerPart :type="1" @getStudentInfo="getStudentInfo"></headerPart>
    <div class="ing-test">
      <a-row>
        <a-col class="test" :span="15" :disabled="!ingTestObject.id" @click="startTest">
          <div class="main-target">{{ ingTestObject.name }}</div>
        </a-col>
        <a-col class="test" :span="9">色盲测试</a-col>
      </a-row>
    </div>
    <div class="history-test">
      <h3>历史测试</h3>
      <div class="list">
        <div class="item" v-for="item, index in dataSource" :key="index">
          <img src="@/assets/school/header.png" alt="avatar" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
export default {
  components: {
    headerPart,
  },
  data() {
    return {
      studentId: this.$static.student_id,
      studentInfo: {},
      ingTestObject: {},
      dataSource: [],
    };
  },
  watch: {
    studentInfo() {
      this.init();
    }
  },
  created() {
  },
  methods: {
    init() {
      this.$axios.schoolGetPapers({schoolId: this.studentInfo.shoolId}).then((res) => {
        if (res.length) {
          const paperList = res.sort((a,b)=>{
            let t1 = new Date(Date.parse(a.createTime.replace(/-/g,"/")));
            let t2 = new Date(Date.parse(b.createTime.replace(/-/g,"/")));
            return t2.getTime()-t1.getTime();
          });
          if (!paperList[0].finishTime) {
            this.ingTestObject = paperList[0];
            this.dataSource = paperList.splice(1);
          } else {
            this.dataSource = paperList;
          }
        }
      });
    },
    startTest() {
      this.$router.push({name: 'studentIntro', params: { type: this.ingTestObject.type }});      
    },
    getStudentInfo(info) {
        this.studentInfo = info;
    },
  }
}
</script>

<style lang="less" scoped>
.home-container {
  .ing-test {
    .test {
      display: flex;
      justify-content: flex-end;
      min-height: 560px;
      cursor: pointer;
      background: no-repeat url(@/assets/student/ingTest.png);
      background-size: cover;
      .main-target {
        padding-top: 160px;
      }
    }
  }
  .history-test {
    .list {
      display: flex;
      gap: 24px;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 0 0 200px;
      }
    }
  }
}
</style>