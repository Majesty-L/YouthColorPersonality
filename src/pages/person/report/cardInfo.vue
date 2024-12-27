<template>
  <div class="card-detail">
    <div class="head">
      <h2 v-html="addPinyin('账号设置')"></h2>
    </div>
    <div class="content">
      <div class="base">
        <h3>小朋友基本信息</h3>
        <div class="mtl mb">
          <img v-if="personInfo.imgUrl" src="personInfo.imgUrl" alt="" width="180px" height="180px"/>
          <img v-else src="@/assets/person/upload.png" alt=""/>
        </div>
        <a-button class="mbl" style="width:120px;margin-bottom: 48px;">+ 更换头像</a-button>
        <div>姓名<a-input class="input" v-model="personInfo.name"/></div>
        <div>出生日期<a-input class="input" v-model="personInfo.birthday"/></div>
        <div>性别<a-input class="input" v-model="personInfo.sex"/></div>
        <a-button class="btn-person -btn" v-html="addPinyin('保存')" @click="onSaveEdit"></a-button>
      </div>
      <div class="pay">
        <h3>账号信息</h3>
        <div class="mtl">注册手机号<a-input class="input" v-model="personInfo.telPhone"/></div>
        <div class="mb">账号密码<a-input type="password" class="input" v-model="personInfo.password"/></div>
        <a-button class="btn-person -btn" v-html="addPinyin('保存')" @click="onSaveEdit"></a-button>
        <div class="mb">购买记录</div>
        <div class=""><a-table :dataSource="dataSource" :columns="columns"></a-table></div>
      </div>
    </div>
  </div>
</template>

<script>
import { html } from 'pinyin-pro';
export default {
  components: {
  },
  data() {
    return {
      addPinyin: html,
      personInfo: {},
      dataSource: [],
      columns: [
        { title: '购买时间', dataIndex: 'createTime', customRender: (text, record, index) => { return record.createTime.split(' ')[0] } },
        { title: '费用', dataIndex: 'fee' },
        { title: '可测试次数', dataIndex: 'number' },
        { title: '有效性', dataIndex: 'hasUsed', customRender: (text, record, index) => { return record.hasUsed === 0 ? '待使用' : '已使用' } },
      ],
      person_id: this.$static.person_id,
    };
  },
  created() {
    this.getPersonInfo();
  },
  methods: {
    getPersonInfo() {
      this.$axios.personInfo({id: this.person_id}).then((res) => {
        if(res.length) {
          this.personInfo = res[0];
        }
      });
      this.$axios.personPay({person_id: this.person_id, paper_id: 1}).then((res) => {
        if (res?.payList?.length) {
          this.dataSource = res.payList;
        }
      });
    },
    onSaveEdit() {
      this.$axios.updatePersonInfo(this.personInfo).then(() => {
        this.$message.success('编辑成功！');
      }).catch((err) => {
        this.$message.error(err);
      })
    },
  }
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  width: 70vw;
  gap: 32px;
  .base, .pay  {
    padding: 3rem;
    flex: 1 0 400px;
    min-height: 80vh;
    border-radius: 24px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
  }
  .input {
    width: 180px;
    margin-left: 12px;
    margin-bottom: 12px;
  }
  .pay {
    .-btn {
      margin: 0 0 2rem;
    }
  }
}
.-btn {
  margin-top: 3rem;
  height: 40px;
  width: 18rem;
  color: #000;
  font-size: 20px;
}
</style>
