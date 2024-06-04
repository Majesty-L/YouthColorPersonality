<template>
  <div>
    <a-layout id="school-layout">
      <a-layout-sider>
        <div class="logo">
          <!-- 头像 -->
          <img src="@/assets/school/header.png" alt="avatar" />
          <span class="title">Little Mood</span>
        </div>
        <a-menu class="menu" theme="dark" mode="inline" :default-selected-keys="['1', 'sub1']"
          :default-open-keys="['sub1']">
          <!-- 各级目录 -->
          <a-menu-item key="1" v-if="!archiveList.length">
            <div class="init-menu">
              <div class="text">
                <a-icon type="appstore" />档案库
              </div>
              <div class="import" @click="importStudentList">+</div>
            </div>
          </a-menu-item>
          <a-sub-menu key="sub1" v-else>
            <span slot="title">
              <router-link :to="{ path: '/school/archive' }"><a-icon type="appstore" />档案库</router-link></span>
            <template v-for="grade in archiveList">
              <a-menu-item v-if="!grade.children" :key="grade.gradeName">
                <router-link :to="{ path: `/school/archive?gradeId=${grade.gradeId}` }">{{ grade.gradeName
                  }}</router-link>
              </a-menu-item>
              <a-sub-menu v-else :key="grade.gradeId">
                <span slot="title">
                  <router-link :to="{ path: `/school/archive?gradeId=${grade.gradeId}` }">{{ grade.gradeName
                    }}</router-link>
                </span>
                <a-menu-item v-for="item in grade.children" :key="`${grade.gradeId}_${item.classId}`">
                  <router-link :to="{ path: `/school/archive?gradeId=${grade.gradeId}&classId=${item.classId}` }">{{
          item.className }}</router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </a-sub-menu>
          <a-menu-item key="2">
            <router-link to="/school/archive">说明文档</router-link>
          </a-menu-item>
          <!-- 更多目录项 -->
        </a-menu>
        <div class="login-info">
          <!-- 登录信息 -->
          <a-button type="primary">登录</a-button>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <!-- 路由页面 -->
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal
      :visible="uploadShow"
    ></a-modal>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  data() {
    return {
      archiveList: [],
      uploadShow: false,
    };
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      this.archiveList = [
        { gradeId: 1, gradeName: '一年级', children: [{ classId: '1-1', className: '1' }] },
        {
          gradeId: 2, gradeName: '二年级', children: [
            { classId: '2-1', className: '1' },
            { classId: '2-2', className: '2' },
            { classId: '2-3', className: '3' },
          ]
        },
        {
          gradeId: 2, gradeName: '二年级', children: [
            { classId: '2-1', className: '1' },
            { classId: '2-2', className: '2' },
            { classId: '2-3', className: '3' },
          ]
        },
        {
          gradeId: 2, gradeName: '二年级', children: [
            { classId: '2-1', className: '1' },
            { classId: '2-2', className: '2' },
            { classId: '2-3', className: '3' },
          ]
        },
        {
          gradeId: 2, gradeName: '二年级', children: [
            { classId: '2-1', className: '1' },
            { classId: '2-2', className: '2' },
            { classId: '2-3', className: '3' },
          ]
        },
        {
          gradeId: 2, gradeName: '二年级', children: [
            { classId: '2-1', className: '1' },
            { classId: '2-2', className: '2' },
            { classId: '2-3', className: '3' },
          ]
        },
      ];
      // this.archiveList = [];
    },
    importStudentList() {
      this.uploadShow = true;
    }
  },
};
</script>

<style lang="less" scoped>
/* 样式调整 */
#school-layout {
  height: 100vh;

  .logo {
    margin-top: 12px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    margin-left: 12px;
    color: aliceblue;
  }

  .menu {
    height: calc(100vh - 80px);
    padding-bottom: 48px;
    overflow: auto;

    .init-menu {
      display: flex;
      justify-content: space-between;
    }
  }

  .login-info {
    position: absolute;
    bottom: 0;
    width: 80%;
    padding: 12px;
    background-color: #1890ff;
  }
}
</style>