<template>
  <div class="home-container">
    <headerPart :type="1" @getStudentInfo="getStudentInfo"></headerPart>
    <div class="ing-test">
        <span v-html="addPinyin('欢迎来到KH色彩性格研究所')"></span>
        <span v-html="addPinyin('我们用色彩探索性格，快来试试吧！')"></span>
        <div class="test main-target" :disabled="!ingTestObject.id" @click="startTest">
          <span v-html="addPinyin('儿童色彩性格测试')"></span>
          <div class="time">
            <div class=""><img src="@/assets/person/homepage-test-1.png" alt="">3道题</div>
            <div class=""><img src="@/assets/person/homepage-test-2.png" alt="">5分钟</div>
          </div>
        </div>
    </div>
    <div class="history-test">
      <h3>测试记录</h3>
      <div class="list">
        <div class="nodata" v-if="!dataSource.length">
          <span v-html="addPinyin('暂时还没有测试记录，')"></span>
          <span v-html="addPinyin('点击上面测试开始你的性格色彩测试之旅吧')"></span>
        </div>
        <div class="item" v-for="item, index in dataSource" :key="index">
          <div :class="item.name.includes('（1）')?'history1 img-title':'history2 img-title'">
            {{ item.name.split('（')[0].split('测试')[1] }}
          </div>
          <span class="second-title">{{ item.name }}</span>
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
      this.$axios.schoolGetPapers({schoolId: this.studentInfo.schoolId}).then((res) => {
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
      if (!this.studentInfo.is_delete && this.studentInfo.known[this.ingTestObject.id] === '是') {
        this.$router.push({name: 'studentIntro', params: { type: this.ingTestObject.type, id: this.ingTestObject.id }});      
      } else {
        this.$message.info('暂无权限！')
      }
    },
    getStudentInfo(info) {
        this.studentInfo = Object.assign({}, info, {known: JSON.parse(info.known || {})});
    },
  }
}
</script>

<style lang="less" scoped>
.home-container {
  .ing-test {
    .main-target {
      background: no-repeat url(@/assets/person/homepage-test.png);
      background-size: cover;
    }
    .color-target {
      background: no-repeat url(@/assets/student/colorTest.png);
      background-size: cover;
    }
  }
  .history-test {
    margin: 36px;
    .list {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      gap: 48px;
      // .item {
      // }
      .history1 {
        height: 160px;
        width: 240px;
        background: no-repeat url(@/assets/student/history1.png);
        background-size: cover;
      }
      .history2 {
        height: 160px;
        width: 240px;
        background: no-repeat url(@/assets/student/history2.png);
        background-size: cover;
      }
      .img-title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 12px;
        border-radius: 12px;
      }
      .second-title {
        font-size: 20px;
      }
    }
  }
}
</style>