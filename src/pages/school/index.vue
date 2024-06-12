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
            <router-link to="/school/archive"><a-icon type="appstore" />年度报告</router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/school/test"><a-icon type="appstore" />新的测试</router-link>
          </a-menu-item>
          <!-- 更多目录项 -->
        </a-menu>
        <div class="footer-info">
          <div key="21">
            <router-link to="/school/archive">关于测试</router-link>
          </div>
          <div key="22">
            <router-link to="/school/archive">使用指南</router-link>
          </div>
          <div key="23">
            <router-link to="/school/archive">常见问题</router-link>
          </div>
          <div key="24">
            <router-link to="/school/archive">退出登录</router-link>
          </div>
          <div>
            <router-link to="/school/intro">
              <img src="@/assets/school/header.png" alt="avatar" />
              <span class="title">xx小学</span>
            </router-link>
          </div>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-content>
          <!-- 路由页面 -->
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  components: {
  },
  data() {
    return {
      archiveList: [],
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
        // {
        //   gradeId: 2, gradeName: '二年级', children: [
        //     { classId: '2-1', className: '1' },
        //     { classId: '2-2', className: '2' },
        //     { classId: '2-3', className: '3' },
        //   ]
        // },
        // {
        //   gradeId: 2, gradeName: '二年级', children: [
        //     { classId: '2-1', className: '1' },
        //     { classId: '2-2', className: '2' },
        //     { classId: '2-3', className: '3' },
        //   ]
        // },
        // {
        //   gradeId: 2, gradeName: '二年级', children: [
        //     { classId: '2-1', className: '1' },
        //     { classId: '2-2', className: '2' },
        //     { classId: '2-3', className: '3' },
        //   ]
        // },
        // {
        //   gradeId: 2, gradeName: '二年级', children: [
        //     { classId: '2-1', className: '1' },
        //     { classId: '2-2', className: '2' },
        //     { classId: '2-3', className: '3' },
        //   ]
        // },
      ];
      // this.archiveList = [];
    },
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

  .footer-info {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 12px;
  }
}
</style>