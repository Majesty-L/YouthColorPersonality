<template>
  <div class="container">
    <h2>色彩测试</h2>
    <a-breadcrumb>
      <a-breadcrumb-item><router-link to="/school/test">色彩测试</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>新的测试</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="step">
      <span>第一步</span>
      <div class="backup">
        <div class="process">
          <div>知情同意书</div>
          <div>为了尊重保护每一位学生的隐私，在每次测试前，我们需要征集每位家长的知情同意。右边是我们提供的知情同意书模版，你可以下载。班主任负责发放给每一位家长并统计他们的同意与否。</div>
          <a-divider></a-divider>
        </div>
        <div class="pdf">
          <div @click="downloadPDF">
            <a-icon type="download" />下载知情同意书
          </div>
        </div>
      </div>
    </div>
    <div class="step">
      <span>第二步</span>
      <div class="backup">
        <div class="txt">
          <div>测试xx</div>
          <div>参与人数： {{ num }}</div>
        </div>
        <div class="btn"><a-button>发布测试</a-button></div>
      </div>
    </div>
    <div class="fixed">
      <a-button>结束测试</a-button>
      <a-button>更新状态</a-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 1,
    };
  },
  methods: {
    downloadPDF() {
      const pdfUrl = '/path/to/your/pdf/file.pdf'; // 替换为实际的PDF文件URL
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = '家长知情同意书.pdf'; // 可以自定义下载的文件名
      link.click();
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  margin: 36px;
  .backup {
    background-color: #fff;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .fixed {
    position: absolute;
    bottom: 24px;
    margin: 0 0 0 40%;
  }
}
</style>