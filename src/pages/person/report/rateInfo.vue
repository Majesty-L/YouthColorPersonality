<!-- 评价反馈页 -->
<template>
  <div class="card-detail">
    <div class="head">
      <h2 v-html="addPinyin('评价反馈')"></h2>
    </div>
    <div class="content">
      <div class="base">
        <h3 v-html="addPinyin('评价')"></h3>
        <a-rate v-model="grade" style="font-size: 36px"></a-rate>
        <h3 class="mtl" v-html="addPinyin('反馈')"></h3>
        <a-textarea v-model="remark" :autosize="{minRows:6}"></a-textarea>
        <a-button class="btn-person -btn" v-html="addPinyin('提交')" @click="onSaveEdit"></a-button>
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
      grade: undefined,
      remark: '',
      personId: this.$static.person_id,
    };
  },
  created() {
    if (!this.personId) {
      this.$router.push({name: 'personWelcome'});
    }
  },
  methods: {
    onSaveEdit() {
      const { grade, remark, personId } = this;
      if (!grade&&grade!==0) {
        this.$message.error('请先评价哦！');
        return;
      }
      this.$axios.callbackRate({grade, remark, personId}).then(() => {
        this.$message.success('提交成功！');
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
  justify-content: center;;
  width: 70vw;
  .base  {
    flex: 1;
    padding: 6rem 3rem;
    max-width: 620px;
    min-height: 70vh;
    border-radius: 24px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
  }
}
.-btn {
  display: block;
  margin: 3rem auto;
  height: 2.5rem;
  width: 18rem;
  color: #000;
  font-size: 1.2rem;
}
</style>
<style lang="less" scoped>
@media (max-width:800px) {
.card-detail {
  .base  {
    padding: 5rem 2rem;
  }
  .-btn {
    width: 12rem;
  }
}
}
</style>
