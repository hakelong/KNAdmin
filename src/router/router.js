import Main from '@/views/Main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['@/views/login.vue'], resolve)
  }
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: resolve => {
    require(['@/views/error-page/404.vue'], resolve)
  }
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: resolve => {
    require(['@//views/error-page/403.vue'], resolve)
  }
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: resolve => {
    require(['@/views/error-page/500.vue'], resolve)
  }
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  component: Main,
  children: [
    {
      path: 'home',
      title: { i18n: 'home' },
      name: 'home_index',
      component: resolve => {
        require(['@/views/home/home.vue'], resolve)
      }
    },
    {
      path: 'users/addlist/:id',
      title: '地址',
      name: 'users_addList',
      component: resolve => {
        require(['@/views/users/addList.vue'], resolve)
      }
    },
    {
      path: 'products/codelist/:id',
      title: '产品管理',
      name: 'products_code',
      component: resolve => {
        require(['@/views/products/codeList.vue'], resolve)
      }
    }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/users',
    icon: 'ios-paper',
    title: '用户管理',
    name: 'users',
    component: Main,
    children: [
      {
        path: 'index',
        title: '用户管理',
        name: 'users_index',
        component: resolve => {
          require(['@/views/users/index.vue'], resolve)
        }
      }
      // {
      //   path: 'addlist/:id',
      //   title: '地址',
      //   name: 'users_addList',
      //   component: resolve => {
      //     require(['@/views/users/addList.vue'], resolve)
      //   }
      // }
    ]
  },
  {
    path: '/products',
    icon: 'ios-paper',
    title: '产品管理',
    name: 'products',
    component: Main,
    children: [
      {
        path: 'list',
        title: '产品管理',
        name: 'products_list',
        component: resolve => {
          require(['@/views/products/list.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/score/products',
    icon: 'ios-paper',
    title: '积分产品管理',
    name: 'scoreProducts',
    component: Main,
    children: [
      {
        path: 'list',
        title: '积分产品管理',
        name: 'scoreProducts_list',
        component: resolve => {
          require(['@/views/scoreProducts/list.vue'], resolve)
        }
      },
      {
        path: 'records',
        title: '兑换记录',
        name: 'scoreProducts_records',
        component: resolve => {
          require(['@/views/scoreProducts/records.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/lottery',
    icon: 'ios-folder',
    name: 'lottery',
    title: '抽奖设置',
    component: Main,
    children: [
      {
        path: 'list',
        icon: 'ios-paper-outline',
        name: 'lottery_list',
        title: '抽奖产品列表',
        component: resolve => {
          require(['@/views/Lottery/list.vue'], resolve)
        }
      },
      {
        path: '/records',
        icon: 'ios-list-outline',
        name: 'lottery_records',
        title: '抽奖记录',
        component: resolve => {
          require(['@/views/Lottery/records.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/order',
    icon: 'ios-paper',
    title: '订单',
    name: 'order',
    component: Main,
    children: [
      {
        path: 'index',
        title: '订单益',
        name: 'order_index',
        component: resolve => {
          require(['@/views/order/index.vue'], resolve)
        }
      }
    ]
  }
]

export const test = {
  path: '/test',
  meta: {
    title: '测试'
  },
  name: 'test',
  component: resolve => {
    require(['@/views/test.vue'], resolve)
  }
}
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
  test,
  page500,
  page403,
  page404,
  
]
