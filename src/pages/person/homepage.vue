<template>
  <div class="home-container">
    <headerPart :type="1"></headerPart>
    <div class="container">
      <div class="ing-test">
        <p class="ing-title" v-html="addPinyin('欢迎来到KH色彩性格研究所')"></p>
        <p class="ing-txt" v-html="addPinyin('我们用色彩探索性格，快来试试吧！')"></p>
        <div class="test main-target" @click="startTest">
          <span class="target-title" v-html="addPinyin('儿童色彩性格测试')"></span>
          <div class="time">
            <span class="flex"><img src="@/assets/person/homepage-test-1.png" alt="" class="i">3道题</span>
            <span class="flex"><img src="@/assets/person/homepage-test-2.png" alt="" class="i">5分钟</span>
          </div>
        </div>
      </div>
      <div class="history-test">
        <h2 v-html="addPinyin('测试记录')"></h2>
        <div class="list">
          <div class="nodata" v-if="!dataSource.length">
            <span v-html="addPinyin('暂时还没有测试记录，')"></span><br/>
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
  </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
import { html } from 'pinyin-pro';
export default {
  components: {
    headerPart,
  },
  data() {
    return {
      addPinyin: html,
      person_id: this.$static.person_id,
      studentInfo: {},
      ingTestObject: {},
      dataSource: [],
      newPayId: 'test',
    };
  },
  watch: {
    // studentInfo() {
    //   this.init();
    // }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.personPay({person_id: this.person_id, paper_id: 1, has_used: 0}).then((res) => {
        if (res.fee === 'free') {
          this.newPayId = 'free';
        } else if (res.list.length) {
          this.newPayId = res[0].id;
        }
      });
      this.$axios.personReport({ person_id: this.person_id }).then((res) => {
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
      if (this.newPayId) {
        // 以有效订单号作为主键开启测试
        this.$router.push({name: 'personIntro', params: { type: 1, id: this.newPayId }});      
      } else {
        // todo:跳转支付
      }
    },
  }
}
</script>

<style lang="less" scoped>
.home-container {
  .container {
    width: 900px;
    margin: 80px auto;
  }
  .ing-test {
    .ing-title {
      font-size: 48px;
      margin-bottom: 16px;
      margin-left: 12px;
    }
    .ing-txt {
      font-size: 20px;
      margin: 16px;
    }
    .main-target {
      cursor: pointer;
      padding: 150px 65% 0 60px;
      height: 460px;
      background: no-repeat url(@/assets/person/homepage-test.png);
      background-size: cover;
      .target-title {
        font-size: 48px;
      }
      .time {
        font-size: 18px;
        .flex {
          display: inline-flex;
          align-items: center;
          margin-right: 24px;
        }
        .time1 {
          margin-right: 24px;
        }
        .i {
          margin-right: 8px;
        }
      }
    }
  }
  .history-test {
    padding: 24px 24px 36px;
    .list {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      gap: 48px;
      .nodata {
        border: 1px dashed #cecece;
        border-radius: 12px;
        height: 180px;
        width: 100%;
        text-align: center;
        padding-top: 80px;
      }
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