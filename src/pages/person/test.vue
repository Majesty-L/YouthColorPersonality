<template>
  <div class="test-container">
    <div class="step">
      <headerPart v-if="current === 99" :type="2"></headerPart>
      <step-part v-else :current="current" @back="back"></step-part>
    </div>
    <div class="content">
      <type1 v-if="type === 1" :showBtn="showBtn" :step="current" :commitRes="commitRes" @changeCur="changeCur">
      </type1>
    </div>
  </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
import stepPart from './components/stepPart.vue';
import type1 from '../modelTests/type1.vue';
export default {
  name: 'TestPage',
  components: {
    headerPart,
    stepPart,
    type1,
  },
  data() {
    return {
      current: 0,
      person_id: this.$static.person_id,
      type: this.$route.params.type || 0,
      id: this.$route.params.id,
      showBtn: true,
      commitRes: undefined,
    };
  },
  created() {
    if (!this.id) {
      this.$router.push({ name: 'personIndex' });
    }
  },
  methods: {
    changeCur([cur, params]) {
      if (cur === 99) {
        this.result(params, cur);
      } else {
        this.current = cur;
      }
    },
    result(params, cur) {
      const finalParams = {
        personId: this.person_id,
        paperType: 1,
        payId: this.id,
        ...params,
      };
      this.$axios.personCommit(finalParams).then((res) => {
        this.current = cur;
        this.commitRes = res;
      }).catch(() => {
        this.$message.error('提交失败，请重试');
      });
    },
    back() {
      if (this.current === 99 || !this.current) {
        this.$router.push({ name: `personIndex` });
      } else {
        this.current--;
      }
    },
  }
}
</script>

<style lang="less" scoped>
.test-container {
  .content {
    background-color: #FAFAFA;
    min-height: calc(100vh - 64px);
  }
}
</style>