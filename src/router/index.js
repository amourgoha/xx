import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/gvrp',
    component: (resolve) => require(['@/views/gvrp'], resolve),
    hidden: true
  },
  {
    path: '/register',
    component: (resolve) => require(['@/views/register'], resolve),
    hidden: true
  },
  {
    path: '/forgotPwd',
    component: (resolve) => require(['@/views/forgotPwd'], resolve),
    hidden: true
  },
  {
    path: '/resetPwd',
    component: (resolve) => require(['@/views/resetPwd'], resolve),
    hidden: true,
    name: 'resetPwd',
  },
  
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      },
      {
        path: 'info',
        hidden: true,
        component: (resolve) => require(['@/views/info'], resolve),
        name: '企业资质填报',
        meta: { title: '企业资质填报', icon: 'dashboard'}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },

  {
    path: '/notice',
    component: Layout,
    children: [
      {
        path: '',
        component: (resolve) => require(['@/views/notice'], resolve),
        name: 'notice',
        meta: { title: '通知公告', icon: 'message' }
      }
    ]
    
  },
  {
    path: '/project',
    component: Layout,
    hidden: false,
    redirect: "noRedirect",
    alwaysShow: true,
    meta: {title: "项目申报", icon: "dict", noCache: false},
    children: [
      {
        path: 'list',
        component: (resolve) => require(['@/views/project/index'], resolve),
        name: 'project',
        meta: { title: '项目列表', icon: 'clipboard' }
      },
      {
        path: 'category',
        component: (resolve) => require(['@/views/project/category'], resolve),
        name: 'category',
        meta: { title: '项目申报类别', icon: 'example' }
      },
      {
        path: 'apply',
        hidden: true,
        component: (resolve) => require(['@/views/project/apply'], resolve),
        name: 'apply',
        meta: { title: '项目申报材料', icon: 'bug' }
      }
    ]
    
  },
  {
    path: '/daozi',
    component: Layout,
    hidden: false,
    redirect: "noRedirect",
    alwaysShow: true,
    meta: {title: "到资确认", icon: "bug", noCache: false},
    children: [
      {
        path: 'list',
        component: (resolve) => require(['@/views/daozi/index'], resolve),
        name: 'daozi',
        meta: { title: '到资反馈', icon: 'example' }
      },
     
    ]
    
  },
]

export default new Router({
  base:'/ent',
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
