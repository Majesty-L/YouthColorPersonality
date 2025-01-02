<template>
  <div class="card-detail">
    <div class="head">
      <h2 v-html="addPinyin('账号设置')"></h2>
    </div>
    <div class="content">
      <div class="base">
        <h3>小朋友基本信息</h3>
        <div class="mtl mb">
          <a-upload
            class="upload-avator"
            list-type="picture-card"
            :show-upload-list="false"
            action="/api/person/uploadAvatar"
            :data="{personId: this.person_id}"
            :before-upload="beforeUpload"
            @change="handleChangeTitleImg"
          >
            <img v-if="personInfo.imgUrl" :src="personInfo.imgUrl" alt="上传成功" width="180px" height="180px"/>
            <img v-else src="@/assets/person/upload.png" alt=""/>
            <a-button class="mbl mt" style="width:120px;margin-bottom: 48px;"><a-icon :type="loading ? 'loading' : 'plus'" /> 更换头像</a-button>
          </a-upload>
        </div>
        <div>姓名<a-input class="input" v-model="personInfo.name"/></div>
        <div>出生日期<a-input class="input" v-model="personInfo.birthday"/></div>
        <div>性别<a-input class="input" v-model="personInfo.sex"/></div>
        <a-button class="btn-person -btn" v-html="addPinyin('保存')" @click="onSaveEdit"></a-button>
      </div>
      <div class="pay">
        <h3>账号信息</h3>
        <div class="mtl">注册手机号<a-input class="input" v-model="personInfo.telPhone"/></div>
        <div class="mb">账号密码<a-input-password class="input" v-model="personInfo.password"/></div>
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
        { title: '购买时间', dataIndex: 'createTime', customRender: (text, record) => { return record.createTime.split(' ')[0] } },
        { title: '费用', dataIndex: 'fee' },
        { title: '可测试次数', dataIndex: 'number' },
        { title: '有效性', dataIndex: 'hasUsed', customRender: (text, record) => { return record.hasUsed === 0 ? '待使用' : '已使用' } },
      ],
      person_id: this.$static.person_id,
      loading: false,
      avatorImgUrl: '',
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
          this.avatorImgUrl = res[0].imgUrl;
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
    handleChangeTitleImg(info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        this.avatorImgUrl = info.file.response.data;
        this.loading = false;
        this.$message.success('更换成功！');
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('请上传图片格式!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小大于2MB!');
      }
      return isJpgOrPng && isLt2M;
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
  .upload-avator {
    /deep/ .ant-upload {
      border: none;
      background: none;
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
