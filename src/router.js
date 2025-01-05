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
      name: 'adminIndex',
      path: '/admin/index',
      component: () => import('@/pages/admin/index.vue'),
    },
    // {
    //   name: 'adminRegister',
    //   path: '/register',
    //   component: () => import('@/pages/admin/register.vue'),
    // },
    // {
    //   name: 'adminOverview',
    //   path: '/overview',
    //   component: () => import('@/pages/admin/overview.vue'),
    // },
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
        {
          name: 'schoolAbout',
          path: '/school/about',
          component: () => import('@/pages/school/about.vue'),
        },
        {
          name: 'schoolGuide',
          path: '/school/guide',
          component: () => import('@/pages/school/guide.vue'),
        },
      ]
    },
    {
      name: 'personLogin',
      path: '/person/login',
      component: () => import('@/pages/person/login.vue'), // 个人登录
    },
    {
      name: 'personWelcome',
      path: '/person/welcome',
      component: () => import('@/pages/person/welcome.vue'), // 个人未登录欢迎页
    },
    {
      name: 'personIndex',
      path: '/person/index',
      component: () => import('@/pages/person/homepage.vue'), // 个人已登录主页
    },
    {
      name: 'personIntro',
      path: '/person/intro',
      component: () => import('@/pages/person/intro.vue'),
    },
    {
      name: 'personTest',
      path: '/person/test',
      component: () => import('@/pages/person/test.vue'),
    },
    {
      name: 'personReport',
      path: '/person/report',
      component: () => import('@/pages/person/report/index.vue'), // 个人测试结果页
      redirect: '/person/report/historyReport',
      children: [
        {
          name: 'personHistoryReport',
          path: '/person/report/historyReport',
          component: () => import('@/pages/person/report/reportView.vue'),
        },
        {
          name: 'personCardInfo',
          path: '/person/report/cardInfo',
          component: () => import('@/pages/person/report/cardInfo.vue'),
        },
        {
          name: 'personCallback',
          path: '/person/report/callback',
          component: () => import('@/pages/person/report/rateInfo.vue'),
        },
      ]
    },
  ],
});

router.beforeEach((to, from, next) => {
  Vue.prototype.$static.school_id = localStorage.getItem('school_id');
  Vue.prototype.$static.student_id = localStorage.getItem('student_id');
  Vue.prototype.$static.person_id = localStorage.getItem('person_id');
  if (['schoolLogin', 'studentLogin', 'personLogin', 'personWelcome'].includes(to.name)) {
    next();
  } else if (to.path.includes('school') && !localStorage.getItem('school_id')) {
    next({ name: 'schoolLogin' });
  } else if (to.path.includes('student') && !localStorage.getItem('student_id')) {
    next({ name: 'studentLogin' });
  } else if (to.path.includes('person') && !localStorage.getItem('person_id')) {
    next({ name: 'personWelcome' });
  } else {
    next();
  }
});

export default router;
