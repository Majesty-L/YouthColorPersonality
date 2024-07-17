<template>
  <div>
    <a-layout id="school-layout">
      <a-layout-sider>
        <div class="logo">
          <!-- 头像 -->
          <img src="@/assets/school/pageIcon.png" alt="avatar" />
          <span class="title">Little Mood</span>
        </div>
        <div class="left">导航栏</div>
        <a-menu class="menu" mode="inline" :default-selected-keys="['sub1']"
          :default-open-keys="['sub1']">
          <!-- 各级目录 -->
          <a-sub-menu key="sub1">
            <span slot="title">
              <router-link :to="{ path: '/school/archive' }"><span class="bold"><img class="mr" src="@/assets/school/menu1.png" alt="">档案库</span></router-link></span>
            <template v-for="grade in archiveList">
              <a-menu-item v-if="!grade.children" :key="grade.gradeName">
                <router-link :to="{ path: `/school/archive?gradeId=${grade.gradeId}` }">{{ grade.gradeName
                  }}</router-link>
              </a-menu-item>
              <a-sub-menu v-else :key="grade.gradeId" class="menu2">
                <span slot="title">
                  <router-link :to="{ path: `/school/archive?gradeId=${grade.gradeId}` }">{{ grade.gradeName
                    }}</router-link>
                </span>
                <a-menu-item v-for="item in grade.children" :key="`${grade.gradeId}_${item.classId}`" class="menu3">
                  <router-link :to="{ path: `/school/archive?gradeId=${grade.gradeId}&classId=${item.classId}` }">{{
          item.className }}</router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
          </a-sub-menu>
          <a-menu-item key="2">
            <router-link to="/school/report"><span class="bold"><img class="mr" src="@/assets/school/menu2.png" alt="">年度报告</span></router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/school/test"><span class="bold"><img class="mr" src="@/assets/school/menu3.png" alt="">色彩测试</span></router-link>
          </a-menu-item>
          <!-- 更多目录项 -->
        </a-menu>
        <div class="footer-info">
          <div key="21" class="else1">
            <router-link to="/school/about"><img class="mr" src="@/assets/school/menu4.png" alt="">关于测试</router-link>
          </div>
          <div key="22" class="else2">
            <router-link to="/school/archive"><img class="mr" src="@/assets/school/menu5.png" alt="">使用指南</router-link>
          </div>
          <div>
            <router-link to="/school/intro">
              <div class="school">
                <div class="title"><img src="@/assets/school/schoolAvator.png" alt="avatar" />{{ schoolInfo.name }}</div>
                <a-icon type="right"></a-icon>
              </div>
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
const sortList = ['一','二','三','四','五','六','七','八','九','十','十一','十二','往届'];
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
              gradeId: key, gradeName: `${key}年级`, createTime: val[0].createTime, children: _.map(_.groupBy(val, 'classNum'), (v, k) => {
                return {
                  classId: `${key}-${k}`, className: `${k}班级`, children: v,
                }
              }),
            }
          }).sort((a,b) => sortList.indexOf(a.gradeId) - sortList.indexOf(b.gradeId));
          this.$store.commit('updateGroupStudent', groupStudent);
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
    padding: 12px 28px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left {
    border-top: 1px solid #E8E8EC;
    padding-top: 12px;
    margin: 0 30px;
    font-size: 12px;
    color: #73737A;
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
    padding-left: 12px;
    overflow: auto;
    box-shadow: 0 8px 0 rgba(0, 0, 0, 0.09);
    border-right: none;

    .init-menu {
      display: flex;
      justify-content: space-between;
    }
    /deep/ .ant-menu-item, .ant-menu-submenu {
      a {
        color: #73737A;
      }
    }
    /deep/ .ant-menu-item-selected {
      border-radius: 24px;
      background-color: #F8F8FA;
    }
    /deep/ .ant-menu-item-selected::after {
      opacity: 0;
    }
    .bold {
      margin-top: -4px;
      font-weight: bold;
      font-size: 16px;
    }
    .menu2 {
      padding-left: 12px;
    }
    .menu3 {
      padding-left: 56px !important;
    }
  }

  .footer-info {
    position: absolute;
    bottom: 36px;
    width: 100%;
    padding: 24px;
    a {
      color: #73737A;
      font-size: 12px;
    }
    .else1 {
      margin-bottom: 12px;
      padding-left: 12px;
    }
    .else2 {
      margin-bottom: 36px;
      padding-left: 12px;
    }
    .school {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 24px;
      padding: 6px;
      background-color: #F8F8FA;
      .title {
        font-size: 14px;
      }
      img {
        width: 24px;
        margin-right: 8px;
      }
    }
  }
}
</style>