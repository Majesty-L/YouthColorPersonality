import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'schoolRegister',
      path: '/register',
      component: () => import('@/pages/register.vue'),
    },
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
        },
        {
          name: 'schoolTest',
          path: '/school/test',
          component: () => import('@/pages/school/colorTest/index.vue'),
        },
        {
          name: 'schoolNewTest',
          path: '/school/newTest',
          component: () => import('@/pages/school/colorTest/test.vue'),
        },
        {
          name: 'schoolIntro',
          path: '/school/intro',
          component: () => import('@/pages/school/intro.vue'),
        },
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
  if (to.name === 'schoolLogin' || to.name === 'studentLogin') {
    next();
  } else if (to.path.includes('school') && !localStorage.getItem('school_id')) {
    next({ name: 'schoolLogin' });
  } else if (to.path.includes('student') && !localStorage.getItem('student_id')) {
    next({ name: 'studentLogin' });
  } else {
    next();
  }
});

export default router;
