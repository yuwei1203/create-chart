export default [
  {
    extra: false,
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        path: '/',
        component: '@/pages/Home',
      },
      {
        path: '/register',
        component: '@/pages/Register',
      },
      {
        path: '/login',
        component: '@/pages/Login',
      },
      {
        path: '/forget',
        component: '@/pages/Forget',
      },
      {
        path: '/share',
        component: '@/pages/Share',
      },
      {
        path: '/viewer',
        component: '@/pages/Viewer',
      },
      {
        path: '/',
        component: '@/layouts/AuthLayout/index',
        routes: [
          {
            path: '/screen',
            component: '@/pages/ScreenList',
          },
          {
            path: '/designer',
            component: '@/pages/Designer',
          },
          {
            path: '/model-designer',
            component: '@/pages/Designer',
          },
          {
            path: '/model',
            component: '@/pages/ModelList',
          },
          {
            path: '/preview',
            component: '@/pages/Previewer',
          },
          {
            path: '/model-preview',
            component: '@/pages/Previewer',
          },
          {
            redirect: '/',
            component: '@/pages/Home',
          },
        ],
      },
      {
        redirect: '/',
        component: '@/pages/Home',
      },
    ],
  },
];
