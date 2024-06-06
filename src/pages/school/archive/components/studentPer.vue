<template>
  <div>
    <h2>单个学生</h2>
    <div class="base-info">
      <div class="avatar">
        <img src="@/assets/school/header.png" alt="avatar" />
      </div>
      <div class="info">
        <div class="name">{{ baseInfo.name }}</div>
        <div class="sex">性别：{{ baseInfo.sex }}</div>
        <div class="age">年龄：{{ baseInfo.age }}岁</div>
      </div>
      <div class="parent">家长知情同意 <a-icon :type="baseInfo.known ? 'check-circle' : 'close-circle'" theme="twoTone" /></div>
    </div>
    <div class="report-list">
      <a-tabs :default-active-key="reportInfos[0].reportId">
        <a-tab-pane v-for="item in reportInfos" :key="item.reportId" :tab="item.reportTime?.split('-')[0]">
          <div v-if="!Object.keys(item).length">未参与本次测试</div>
          <div v-else>
            <h3>分析报告</h3>
              <div class="num-info">
                <div class="animal">
                  <div>色彩形象</div>
                  <img src="@/assets/school/header.png" alt="色彩形象" />
                </div>
                <div class="num-wrapper">
                  <div>色彩心理特征指数</div>
                  <div class="line" v-for="report, index in [['内认同', '外认同'], ['理性', '感性'], ['个性', '群体'], ['执行', '幻想'], ['果断', '清晰']]" :key="index">
                    <span>{{ report[0] }}</span><a-slider class="slider" range :default-value="[item.characteristic[index], item.characteristic[index]]" :min="-10" :max="10" disabled /><span>{{ report[1] }}</span>
                  </div>
                </div>
              </div>
              <div class="text-container">
                <div class="text" v-for="title, index in ['个人特质', '学习风格', '沟通方式', '人际关系']" :key="title">
                  <div class="title">{{ title }}</div>
                  <div class="text-content">{{ item[['personInfo', 'studyInfo', 'commuInfo', 'socialInfo'][index]] }}</div>
                </div>
              </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseInfo: {},
      reportInfos: {},
    };
  },
  created() {
    this.getStudentInfo();
  },
  methods: {
    getStudentInfo() {
      this.baseInfo = { id: 1, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 };
      this.reportInfos = [
        { reportId: 1, reportTime: '2024-06-06', animal: 1, characteristic: [4, 7, -6, 5, 0], personInfo: 'xxxxxx', studyInfo: '学习学习', commuInfo: '沟通沟通', socialInfo: '人际人际' },
        { reportId: 2, reportTime: '2023-06-06', animal: 2, characteristic: [-4, -7, 6, 9, 2], personInfo: 'xxxxxx', studyInfo: '学习1学习', commuInfo: '沟通2沟通', socialInfo: '人际人际' },
      ];
    },
  },
}
</script>

<style lang="less" scoped>
.base-info {
  display: flex;
  gap: 12rem;
  margin-top: 48px;
}
.report-list {
  margin-top: 48px;
  .num-info {
    display: flex;
    gap: 12rem;
    .line {
      display: flex;
      align-items: center;
      .slider {
        display: inline-block;
        width: 300px;
      }
      span {
        width: 50px;
      }
    }
  }
  .text-container {
    margin-top: 48px;
    .text {
      height: 100px;
    }
  }
}
</style>