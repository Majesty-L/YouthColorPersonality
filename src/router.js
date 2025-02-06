import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/person/welcome',
      component: () => import('@/App'),
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
  Vue.prototype.$static.person_id = localStorage.getItem('person_id');
  if (['personLogin', 'personWelcome'].includes(to.name)) {
    next();
  } else if (to.path.includes('person') && !localStorage.getItem('person_id')) {
    next({ name: 'personWelcome' });
  } else {
    next();
  }
});

export default router;
