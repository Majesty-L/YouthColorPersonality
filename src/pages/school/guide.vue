<template>
  <div class="about-container">
    <h1 class="title">使用指南</h1>
    <div class="container">
      <div class="section">
        <span class="head">档案库</span>
        <div class="text">
          <div class="paragraph">1、	初始学生信息为空，从首页跳转到学校信息页按年级上传学生信息</div>
          <div class="paragraph">2、	先下载excel【下载表格模板】获取上传需要的的学生信息模板，按第一行的示例填充完数据，并按原表格格式上传（必须按模板上传，否则学生信息解析将不完整），系统将从第三行开始解析学生信息。</div>
          <div class="paragraph">3、	每次上传将覆盖原来该年级所有的学生信息，原学生信息及学生已有的报告将无法查看，建议仅在第一次进入系统时按年级上传学生信息，学生年级及年龄每年会自动更新，其中年级会根据学生类别升级或变成往届，往届学生信息只保留一年，每年九月新生入学时可录入一年级学生信息</div>
          <div class="paragraph">4、	录入后可在侧边栏看到所有学生的年级班级树状关系</div>
          <div class="paragraph">5、	在班级档案中可进行单个学生的新增删除和编辑，此处的操作不会影响已有的学生报告</div>
        </div>
      </div>
      <div class="section">
        <span class="head">年度报告</span>
        <div class="text">
          <div class="paragraph">1、	在年度报告中查看单个问卷报告，可以筛选部分年级班级等学生信息生成报告，可以将报告导出为pdf
          </div>
          <div class="paragraph">2、  在班级档案中查看单个学生的报告</div>
        </div>
      </div>
      <div class="section">
        <span class="head">色彩测试</span>
        <div class="text">
          <div class="paragraph">1、	新建问卷，在色彩测试页点击【+新的测试】按钮，新建本学期测试问卷</div>
          <div class="paragraph">2、	发布问卷
            <div class="paragraph">1）	下载知情同意书，学校方下发给学生家长</div>
            <div class="paragraph">2）	下载表格模板，填入每位学生的知情同意情况</div>
            <div class="paragraph">3）	上传2中填写的表格，更新知情情况，未填或填否的学生将无权限参与本次问卷</div>
            <div class="paragraph">4）	最后点击发布测试，该问卷开放给参与的学生</div>
          </div>
          <div class="paragraph">3、	可在色彩测试中看到进行中的测试，查看测试状态可更新知情情况或结束问卷，结束的问卷可在历史测试中查看</div>
          <div class="paragraph">4、	可以设置短信提醒，设置成功将在设置的时间给预留的手机发送新建问卷的提醒短信</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
    };
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.about-container {
  margin: 72px;
  line-height: 150%;
  .title {
    font-size: 36px;
  }
  .container {
    padding: 48px 0;
    .section {
      margin: 36px 12px;
      text-align: justify;
    }
    .head {
      border-bottom: 2px solid #E8E8EC;
      font-size: 20px;
    }
    .text {
      margin: 24px 0;
      font-size: 14px;
      .paragraph {
        text-indent: 28px;
      }
    }
  }
}
</style>