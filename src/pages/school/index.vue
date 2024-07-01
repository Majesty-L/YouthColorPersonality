<template>
  <div>
    <a-layout id="school-layout">
      <a-layout-sider>
        <div class="logo">
          <!-- 头像 -->
          <img src="@/assets/school/pageIcon.png" alt="avatar" />
          <span class="title">Little Mood</span>
        </div>
        <a-menu class="menu" mode="inline" :default-selected-keys="['sub1']"
          :default-open-keys="['sub1']">
          <!-- 各级目录 -->
          <a-sub-menu key="sub1">
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
          <div>
            <router-link to="/school/intro">
              <img src="@/assets/school/schoolAvator.png" alt="avatar" />
              <span class="title">{{ schoolInfo.name }}</span>
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
import _ from 'lodash';
export default {
  name: 'AppLayout',
  components: {
  },
  data() {
    return {
      schoolId: this.$static.school_id,
      archiveList: [],
      schoolInfo: {},
    };
  },
  watch: {
    '$store.state.groupStudent'(val) {
          this.archiveList = val;
    },
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      this.$axios.schoolStudentInfo({schoolId: this.schoolId}).then((res) => {
          const originStudentAll = res;
          const groupStudent = _.map(_.groupBy(originStudentAll, 'grade'), (val, key) => {
            return {
              gradeId: key, gradeName: `${key}年级`, children: _.map(_.groupBy(val, 'classNum'), (v, k) => {
                return {
                  classId: `${key}-${k}`, className: `${k}班级`, children: v,
                }
              }),
            }
          });
          this.$store.commit('updateGroupStudent', groupStudent);
          // this.archiveList = this.$store.state.groupStudent;
      });
      this.$axios.schoolInfo({schoolId: this.schoolId}).then((res) => {
        this.schoolInfo = res;
      })
    },
  },
};
</script>

<style lang="less" scoped>
/* 样式调整 */
#school-layout {
  height: 100vh;

  .ant-layout-sider
  // .ant-menu-dark, .ant-menu-dark .ant-menu-sub, 
  // /deep/.ant-menu-dark .ant-menu-inline.ant-menu-sub 
  {
    background-color: #fff;
    box-shadow: none;
  }
  // .ant-menu-dark .ant-menu-item, .ant-menu-dark .ant-menu-item-group-title, .ant-menu-dark .ant-menu-item > a {
  //   color: #000;
  // }
  .logo {
    margin-top: 12px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    margin-left: 6px;
    color: #5A5A61;
    font-size: 18px;
    font-weight: bold;
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
    padding: 24px;
  }
}
</style>