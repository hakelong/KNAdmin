import Vue from 'vue'
import iView from 'iview'
import Util from '../libs/util'
import VueRouter from 'vue-router'
import { routers } from './router'
import Cookies from 'js-cookie'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routers
}

export const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  Util.title(to.meta.title)
  let isLogin = !Util.isNullEmptyOrUndefined(Cookies.get('Authorization'))
  if (!isLogin && to.name !== 'login') {
    // 判断是否已经登录且前往的页面不是登录页
    next({ name: 'login' })
  } else if (isLogin && (to.name === 'login' || to.name === 'root')) {
    // 判断是否已经登录且前往的是登录页
    next({ name: 'users_index' })
  } else {
    next()
  }
  iView.LoadingBar.finish()
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
