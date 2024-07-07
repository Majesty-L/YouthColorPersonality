import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/student/login',
      component: () => import('@/App'),
    },
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
      name: 'studentIndex',
      path: '/student/index',
      component: () => import('@/pages/student/homepage.vue'),
    },
    {
      name: 'studentIntro',
      path: '/student/intro',
      component: () => import('@/pages/student/intro.vue'),
    },
    {
      name: 'studentTest',
      path: '/student/test',
      component: () => import('@/pages/student/test.vue'),
    },
    {
      name: 'studentReport',
      path: '/student/report',
      component: () => import('@/pages/student/historyReport.vue'),
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
        {
          name: 'schoolReport',
          path: '/school/report',
          component: () => import('@/pages/school/report/index.vue'),
        },
      ]
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
    Vue.prototype.$static.school_id = localStorage.getItem('school_id');
    Vue.prototype.$static.student_id = localStorage.getItem('student_id');
    next();
  }
});

export default router;
