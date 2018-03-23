import axios from 'axios'
import env from '../../build/env'
import semver from 'semver'
import packjson from '../../package.json'
import Md5 from 'js-md5'
import Cookies from 'js-cookie'

let util = {}
util.title = function(title) {
  title = title || 'iView admin'
  window.document.title = title
}

const ajaxUrl =
  env === 'development'
    ? 'http://fwtest.51xunguo.com'
    : env === 'production'
      ? 'http://backend.gsp365.com'
      : 'http://www.51xunguo.com:9090'

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
})

util.ajax.interceptors.request.use(
  function(config) {
    if (!util.isNil(config.data)) {
      // 将请求参数值 undefined 替换成 ''
      const keys = Object.keys(config.data)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (util.isNil(config.data[key])) {
          config.data[key] = ''
        }
      }
    }

    config.headers.ACCESS_DOMAIN_AUTH = window.location.hostname
    config.headers.vc = util.vc(config.data)
    config.headers.Authorization = Cookies.get('Authorization')

    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

util.isNil = function(obj) {
  return this.isNullEmptyOrUndefined(obj)
}

/**
 * 判断对象是否为空、null 或 undefined
 * @param obj
 * @returns {boolean}
 */
util.isNullEmptyOrUndefined = function(obj) {
  if (typeof obj === typeof '') {
    return obj.trim().length < 1
  }

  if (typeof obj === typeof 0 || typeof obj === typeof false) {
    return false
  }

  if (typeof obj === 'undefined' || obj === null) {
    return true
  } else {
    return false
  }
}

/**
 * 克隆对象
 * @param obj
 * @returns {*}
 */
util.cloneObj = function(obj) {
  let str
  let newobj = obj.constructor === Array ? [] : {}
  if (typeof obj !== 'object') {
    return
  } else if (window.JSON) {
    str = JSON.stringify(obj) // 系列化对象
    newobj = JSON.parse(str) // 还原
  } else {
    for (let i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? util.cloneObj(obj[i]) : obj[i]
    }
  }
  return newobj
}

/**
 * 计算一个请求的VC值
 * @param request http请求
 * @returns {String} VC值
 */
util.vc = function(data) {
  let strTemp = ''
  if (!this.isNil(data)) {
    let requestKeys = []
    for (let key in data) {
      requestKeys.push(key)
    }

    requestKeys.sort()

    for (let i = 0; i < requestKeys.length; i++) {
      strTemp += data[requestKeys[i]] + '#'
    }
  }
  strTemp += 'YIDD#^%'
  return Md5(strTemp).toString()
}

util.inOf = function(arr, targetArr) {
  let res = true
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

util.oneOf = function(ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

util.showThisRoute = function(itAccess, currentAccess) {
  if (typeof itAccess === 'object' && itAccess.isArray()) {
    return util.oneOf(currentAccess, itAccess)
  } else {
    return itAccess === currentAccess
  }
}

util.getRouterObjByName = function(routers, name) {
  let routerObj = {}
  routers.forEach(item => {
    if (item.name === 'otherRouter') {
      item.children.forEach((child, i) => {
        if (child.name === name) {
          routerObj = item.children[i]
        }
      })
    } else {
      if (item.children.length === 1) {
        if (item.children[0].name === name) {
          routerObj = item.children[0]
        }
      } else {
        item.children.forEach((child, i) => {
          if (child.name === name) {
            routerObj = item.children[i]
          }
        })
      }
    }
  })
  return routerObj
}

util.handleTitle = function(vm, item) {
  return item.title
}

util.setCurrentPath = function(vm, name) {
  let title = ''
  let isOtherRouter = false
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item)
        if (item.name === 'otherRouter') {
          isOtherRouter = true
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child)
          if (item.name === 'otherRouter') {
            isOtherRouter = true
          }
        }
      })
    }
  })
  let currentPathArr = []
  if (name === 'home_index') {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
        ),
        path: '',
        name: 'home_index'
      }
    ]
  } else if (
    (name.indexOf('_index') >= 0 || isOtherRouter) &&
    name !== 'home_index'
  ) {
    currentPathArr = [
      {
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')
        ),
        path: '/home',
        name: 'home_index'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ]
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name
      } else {
        let i = 0
        let childArr = item.children
        let len = childArr.length
        while (i < len) {
          if (childArr[i].name === name) {
            return true
          }
          i++
        }
        return false
      }
    })[0]
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
      currentPathArr = [
        {
          title: '首页',
          path: '',
          name: 'home_index'
        }
      ]
    } else if (
      currentPathObj.children.length <= 1 &&
      currentPathObj.name !== 'home'
    ) {
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: name
        }
      ]
    } else {
      let childObj = currentPathObj.children.filter(child => {
        return child.name === name
      })[0]
      currentPathArr = [
        {
          title: '首页',
          path: '/home',
          name: 'home_index'
        },
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + '/' + childObj.path,
          name: name
        }
      ]
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr)

  return currentPathArr
}

util.openNewPage = function(vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList
  let openedPageLen = pageOpenedList.length
  let i = 0
  let tagHasOpened = false
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) {
      // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      })
      tagHasOpened = true
      break
    }
    i++
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter(item => {
      if (item.children) {
        return name === item.children[0].name
      } else {
        return name === item.name
      }
    })
    tag = tag[0]
    if (tag) {
      tag = tag.children ? tag.children[0] : tag
      if (argu) {
        tag.argu = argu
      }
      if (query) {
        tag.query = query
      }
      vm.$store.commit('increateTag', tag)
    }
  }
  vm.$store.commit('setCurrentPageName', name)
}

util.toDefaultPage = function(routers, name, route, next) {
  let len = routers.length
  let i = 0
  let notHandle = true
  while (i < len) {
    if (routers[i].name === name && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      })
      notHandle = false
      next()
      break
    }
    i++
  }
  if (notHandle) {
    next()
  }
}

util.fullscreenEvent = function(vm) {
  // 权限菜单过滤相关
  vm.$store.commit('updateMenulist')
}

util.checkUpdate = function(vm) {
  axios
    .get('https://api.github.com/repos/iview/iview-admin/releases/latest')
    .then(res => {
      let version = res.data.tag_name
      vm.$Notice.config({
        duration: 0
      })
      if (semver.lt(packjson.version, version)) {
        vm.$Notice.info({
          title: 'iview-admin更新啦',
          desc:
            '<p>iView-admin更新到了' +
            version +
            '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
        })
      }
    })
}

export default util
