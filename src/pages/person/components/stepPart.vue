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
        studentId: this.$static.student_id,
        studentInfo: {},
      };
    },
    created() {
      // this.init();
    },
    methods: {
      init () {
        this.$axios.schoolStudentInfo({studentId: this.studentId}).then((res) => {
          if(res.length) {
            this.studentInfo = res[0];
            this.$emit('getStudentInfo', res[0]);
          }
        });
      },
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
    .back {
      cursor: pointer;
    }
    .step {
      top: 0.4rem;
    }
  }
  </style>
  <style lang="less" scoped>
  @media (max-width: 768px) {
  .header {
    height: 3rem;
    padding: 1rem 0.8rem;
    .back {
      font-size: 0.8rem;
    }
    /deep/ .ant-steps-item-container {
      width: 6rem;
    }
  }
  }
  </style>
  <style lang="less" scoped>
  @media (max-width: 550px) {
  .header {
    height: 3rem;
    padding: 1rem 0.8rem;
    .back {
      font-size: 0.6rem;
    }
    /deep/ .ant-steps-item, /deep/ .ant-steps-item-container, /deep/ .ant-steps-item-wait {
      width: 2rem;
    }
    /deep/ .ant-steps {
      width: 80%;
    }
  }
  }
  </style>