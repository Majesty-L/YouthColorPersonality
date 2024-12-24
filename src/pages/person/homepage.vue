<template>
  <div class="home-container">
    <headerPart :type="1"></headerPart>
    <div class="container">
      <div class="ing-test">
        <p class="ing-title" v-html="addPinyin('欢迎来到KH色彩性格研究所')"></p>
        <p class="ing-txt" v-html="addPinyin('我们用色彩探索性格，快来试试吧！')"></p>
        <div class="main-target" @click="startTest">
          <div class="target-title" v-html="addPinyin('儿童色彩性格测试')"></div>
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
            <div class="history2 img-title" v-html="addPinyin(resultObject[item.characterId].animal)"></div>
            <span class="second-title">{{ item.createTime.split(' ')[0]?.replaceAll('-', '/') }}</span>
          </div>
        </div>
      </div>
    </div>
    <wxpay :visible="visiblePrePay" @success="onPaySuccess" @cancel="onPayCancel"></wxpay>
  </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
import { html } from 'pinyin-pro';
import { resultObject } from './data.js';
import wxpay from './components/wxpay.vue';
export default {
  components: {
    headerPart,
    wxpay,
  },
  data() {
    return {
      addPinyin: html,
      person_id: this.$static.person_id,
      studentInfo: {},
      ingTestObject: {},
      dataSource: [],
      newPayId: '',
      resultObject,
      visiblePrePay: false,
    };
  },
  watch: {
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$axios.personPay({person_id: this.person_id, paper_id: 1, has_used: 0}).then((res) => {
        if (res?.fee === 'free') {
          this.newPayId = 'free';
        } else if (res?.list?.length) {
          this.newPayId = res[0].id;
        }
      });
      this.$axios.personReport({ personId: this.person_id }).then((res) => {
        if (res.length) {
          const paperList = res.sort((a,b)=>{
            let t1 = new Date(Date.parse(a.createTime.replace(/-/g,"/")));
            let t2 = new Date(Date.parse(b.createTime.replace(/-/g,"/")));
            return t2.getTime()-t1.getTime();
          });
          this.dataSource = paperList;
          console.log(paperList);
        }
      });
    },
    startTest() {
      if (this.newPayId) {
        // 以有效订单号作为主键开启测试
        this.$router.push({name: 'personIntro', params: { type: 1, id: this.newPayId }});      
      } else {
        this.visiblePrePay = true;
      }
    },
    onPaySuccess() {
      this.visiblePrePay = false;
    },
    onPayCancel() {
      this.visiblePrePay = false;
    },
  }
}
</script>

<style lang="less" scoped>
.home-container {
  .container {
    max-width: 900px;
    margin: 5rem auto;
  }
  .ing-test {
    .ing-title {
      font-size: 3rem;
      margin-bottom: 1rem;
      margin-left: 0.8rem;
    }
    .ing-txt {
      font-size: 1.25rem;
      margin: 1rem;
    }
    .main-target {
      cursor: pointer;
      padding: 9rem 0 9rem 4rem;
      // height: 29rem;
      background: no-repeat url(@/assets/person/homepage-test.png);
      background-size: 100%;
      .target-title {
        font-size: 3rem;
        width: 18rem;
      }
      .time {
        font-size: 1.1rem;
        .flex {
          display: inline-flex;
          align-items: center;
          margin-right: 1.5rem;
        }
        .time1 {
          margin-right: 1.5rem;
        }
        .i {
          margin-right: 0.5rem;
          width: 1rem;
        }
      }
    }
  }
  .history-test {
    padding: 1.5rem 1.5rem 2rem;
    .list {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      gap: 1.5rem;
      .nodata {
        border: 1px dashed #cecece;
        border-radius: 12px;
        height: 10rem;
        width: 100%;
        text-align: center;
        padding-top: 4rem;
      }
      .item {
        flex: 0 1 20%;
      }
      .history2 {
        height: 10rem;
        width: 11rem;
        background: no-repeat url(@/assets/person/history3.png);
        background-size: cover;
      }
      .img-title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 0.8rem;
        border-radius: 12px;
      }
      .second-title {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@media (max-width: 800px) {
.home-container {
  .container {
  }
  .ing-test {
    .ing-title {
    }
    .ing-txt {
    }
    .main-target {
      padding: 5rem 0 5rem 3rem;
      .target-title {
        font-size: 2.6rem;
        width: 15rem;
      }
      .time {
        margin-top: 2rem;
        font-size: 1.1rem;
        .flex {
        }
      }
    }
  }
  .history-test {
    .list {
      .nodata {
      }
      .item {
      }
      .history2 {
        height: 7rem;
        width: 9rem;
      }
      .img-title {
        font-size: 2rem;
      }
      .second-title {
      }
    }
  }
}
}
</style>

<style lang="less" scoped>
@media (max-width: 500px) {
.home-container {
  .container {
  }
  .ing-test {
    .ing-title {
      font-size: 1.9rem;
    }
    .ing-txt {
      font-size: 1rem;
    }
    .main-target {
      padding: 3rem 0 2rem 1.6rem;
      // min-height: 220px;
      background-size: 100% 100%;
      .target-title {
        font-size: 1.8rem;
        max-width: 10rem;
      }
      .time {
        margin-top: 1.5rem;
        font-size: 0.8rem;
        .flex {
        }
      }
    }
  }
  .history-test {
    padding: 1.5rem 1rem 2rem;
    .list {
      gap: 0.4rem;
      .nodata {
      }
      .item {
      }
      .history2 {
        height: 4rem;
        width: 5.6rem;
      }
      .img-title {
        font-size: 1.2rem;
        margin-bottom: 0.2rem;
        border-radius: 8px;
      }
      .second-title {
        font-size: 0.8rem;
      }
    }
  }
}
}
</style>
<style lang="less" scoped>
@media (max-width: 420px) {
.home-container {
  .container {
  }
  .ing-test {
    .ing-title {
      font-size: 1.6rem;
    }
    .ing-txt {
      font-size: 0.8rem;
    }
    .main-target {
      padding: 3rem 0 2rem 1.6rem;
      // min-height: 220px;
      background-size: 100% 100%;
      .target-title {
        font-size: 1.2rem;
        max-width: 7rem;
      }
      .time {
        margin-top: 1.5rem;
        font-size: 0.6rem;
        .flex {
          margin-right: 0.5rem;
          .i {
            width: 8px;
          }
        }
      }
    }
  }
  .history-test {
    padding: 1.5rem 1rem 2rem;
    .list {
      gap: 0.4rem;
      .nodata {
      }
      .item {
      }
      .history2 {
        height: 4rem;
        width: 5.6rem;
      }
      .img-title {
        font-size: 1.2rem;
        margin-bottom: 0.2rem;
        border-radius: 8px;
      }
      .second-title {
        font-size: 0.8rem;
      }
    }
  }
}
}
</style>