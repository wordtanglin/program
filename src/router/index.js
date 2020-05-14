/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [{
    path: '*', // 其他没有的页面都重定向到 home页面去
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      keepAlive: false,
    },
    // component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    component: (resolve) => require(['../views/Home.vue'], resolve),
  },
  {
    path: '/detail',
    name: 'detail',
    meta: {
      keepAlive: false,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: (resolve) => require(['../views/Detail.vue'], resolve),
  },
  {
    path: '/code',
    name: 'code',
    meta: {
      keepAlive: false,
    },
    component: (resolve) => require(['../views/Code.vue'], resolve),
  },
  {
    path: '/study',
    name: 'study',
    meta: {
      keepAlive: false,
    },
    component: (resolve) => require(['../views/Study.vue'], resolve),
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      keepAlive: false,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: (resolve) => require(['../views/Admin.vue'], resolve),
  },
  {
    path: '/test',
    name: 'test',
    meta: {
      keepAlive: false,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: (resolve) => require(['../views/test.vue'], resolve),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, saveTop) {
    if (saveTop) {
      return saveTop;
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  },
});

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('userId')) {
    // 如果已经登录的话
    next();
  } else {
    if (to.path === '/home') {
      // 如果是登录页面的话，直接next()
      next();
    } else {
      // 否则 跳转到登录页面
      next({
        path: '/home',
      });
    }
  }
});

export default router;