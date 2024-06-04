import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'studentLogin',
      path: '/student/login',
      component: () => import('@/pages/student/login.vue'),
    },
    {
      name: 'schoolLogin',
      path: '/school/login',
      component: () => import('@/pages/school/login.vue'),
    },
    {
      name: 'schoolIndex',
      path: '/school/index',
      component: () => import('@/pages/school/index.vue'),
      redirect: '/school/archive',
      children: [
        {
          name: 'schoolArchive',
          path: '/school/archive',
          component: () => import('@/pages/school/archive/index.vue'),
        }
      ]
    },
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
      path: '/color_web/result/:paper_id',
      component: () => import('@/pages/Result'),
    },
    {
      name: 'edit',
      path: '/color_web/edit/:paper_id/:paper_name',
      component: () => import('@/pages/Edit'),
    },
    {
      name: 'view',
      path: '/color_web/view/:paper_id',
      component: () => import('@/pages/View'),
    },
    {
      name: 'preview',
      path: '/color_web/preview/:paper_id/:paper_name',
      component: () => import('@/pages/Preview'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  next();
  // const isAuthenticated = !!localStorage.getItem('color_name'); // 判断用户是否已登录过

  // if (to.name === 'view') {
  //   next(); // 填写页面不需要登陆
  // } else if (to.name !== 'login' && !isAuthenticated) {
  //   next({ name: 'login' }); // 如果未登录且要访问的页面不是登录页面，则重定向到登录页面
  // } else {
  //   next(); // 已登录或访问的是登录页面，则继续导航
  // }
});

export default router;
