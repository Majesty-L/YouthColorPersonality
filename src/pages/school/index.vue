<template>
  <a-layout id="app-layout">
    <a-layout-sider>
      <div class="logo">
        <!-- 头像 -->
        <img src="@/assets/school/header.png" alt="avatar" />
      </div>
      <a-menu theme="dark" mode="inline">
        <!-- 各级目录 -->
        <a-menu-item key="1">
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/docs">说明文档</router-link>
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
</template>

<script>
export default {
  name: 'AppLayout',
};
</script>

<style lang="less" scoped>
/* 样式调整 */
#app-layout .logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#app-layout .login-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 12px;
  background-color: #1890ff;
}
</style>