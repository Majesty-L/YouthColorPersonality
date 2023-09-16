import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/color_web/admin',
      component: () => import('@/App'),
    },
    {
      name: 'login',
      path: '/color_web/login',
      component: () => import('@/pages/Login'),
    },
    {
      name: 'admin',
      path: '/color_web/admin',
      component: () => import('@/pages/Admin'),
    },
    {
      name: 'result',
      path: '/color_web/result/:paper_id/:question_id',
      component: () => import('@/pages/Result'),
    },
    {
      name: 'edit',
      path: '/color_web/edit/:paper_id',
      component: () => import('@/pages/Edit'),
    },
    {
      name: 'view',
      path: '/color_web/view/:paper_id',
      component: () => import('@/pages/View'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('colorAuth'); // 判断用户是否已登录过

  if (to.name === 'view') {
    next(); // 填写页面不需要登陆
  } else if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' }); // 如果未登录且要访问的页面不是登录页面，则重定向到登录页面
  } else {
    next(); // 已登录或访问的是登录页面，则继续导航
  }
});

export default router;
