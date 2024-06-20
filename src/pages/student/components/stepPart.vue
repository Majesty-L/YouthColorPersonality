<template>
    <div class="header">
        <a-row>
            <a-col :span="4" class="back">back</a-col>
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
    },
  }
  </script>
  
  <style lang="less" scoped>
  .header {
    height: 64px;
    padding-top: 12px;
    border-bottom: 1px solid;
  }
  </style>