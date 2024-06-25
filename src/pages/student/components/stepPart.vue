<template>
    <div class="header">
        <a-row>
            <a-col :span="4" class="back" @click="back"><a-icon type="left"></a-icon> 上一步</a-col>
            <a-col :span="20" class="step">
                <a-steps :current="current">
                    <template slot="progressDot" slot-scope="{ prefixCls }">
                        <span :class="`${prefixCls}-icon-dot`"></span>
                    </template>
                    <a-step />
                    <a-step />
                    <a-step />
                    <a-step />
                </a-steps>
            </a-col>
        </a-row>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      current: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
      };
    },
    created() {
    },
    methods: {
      back() {
        this.$emit('back');
      }
    },
  }
  </script>
  
  <style lang="less" scoped>
  .header {
    height: 64px;
    padding: 24px 12px;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
    border-bottom: 1px solid;
    .back {
      cursor: pointer;
    }
  }
  </style>