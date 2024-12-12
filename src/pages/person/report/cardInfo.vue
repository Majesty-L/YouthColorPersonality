<template>
  <div class="card-detail">
    <div class="head">
      <h2 v-html="addPinyin('账号设置')"></h2>
    </div>
    <div class="content">
      <div class="base">
        <h3>小朋友基本信息</h3>
        <div class="mtl mb"><img src="@/assets/person/upload.png" alt=""></div>
        <a-button class="mbl" style="width:120px;margin-bottom: 48px;">+ 更换头像</a-button>
        <div>姓名<a-input class="input" v-model="studentInfo.name"/></div>
        <div>出生日期<a-input class="input" v-model="studentInfo.name"/></div>
        <div>性别<a-input class="input" v-model="studentInfo.name"/></div>
        <a-button class="btn-person -btn" v-html="addPinyin('保存')"></a-button>
      </div>
      <div class="pay">
        <h3>账号信息</h3>
        <div class="mtl">注册手机号<a-input class="input" v-model="studentInfo.name"/></div>
        <div class="mbl">账号密码<a-input type="password" class="input" v-model="studentInfo.name"/></div>
        <div class="mb">购买记录</div>
        <a-table :dataSource="dataSource" :columns="columns"></a-table>
      </div>
    </div>
  </div>
</template>

<script>
import { resultObject } from '../data.js';
import { html } from 'pinyin-pro';
export default {
  components: {
  },
  data() {
    return {
      addPinyin: html,
      studentInfo: {},
      dataSource: [],
      columns: [
        { title: '购买时间', dataIndex: 'name' },
        { title: '费用', dataIndex: 'sex' },
        { title: '可测试次数', dataIndex: 'birthday' },
        { title: '有效性', dataIndex: 'createTime' },
      ],
    };
  },
  created() {
    this.getPersonInfo();
  },
  methods: {
    getPersonInfo() {
        this.$axios.personReport({personId: this.person_id}).then((res) => {
          const result = res.sort((a, b) => new Date(Date.parse(b.createTime)) - new Date(Date.parse(a.createTime)));
          this.reportList = result.map(item => ({...item, detail: resultObject[item.characterId], name: item.createTime.split(' ')[0]}));
          this.selectReport = this.reportList[0] || {};
          console.log(this.reportList);
        })
    },
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  .base, .pay  {
    padding: 48px;
    width: 38vw;
    min-height: 80vh;
    border-radius: 24px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
  }
  .base {
    margin-right: 32px;
  }
  .input {
    width: 30%;
    margin-left: 12px;
    margin-bottom: 12px;
  }
}
.-btn {
  margin-top: 48px;
  height: 40px;
  width: 260px;
  color: #000;
  font-size: 20px;
}
</style>
