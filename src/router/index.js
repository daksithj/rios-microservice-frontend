import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/driver',
    children: [
      {
        path: 'driver',
        component: () => import('@/views/permission/role'),
        name: 'driverDetails',
        meta: {
          title: 'Driver Details',
          roles: ['admin']
        }
      },
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
 
 
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/delivery',
    component: Layout,
    redirect: '/delivery/page',
    alwaysShow: true, // will always show the root menu
    name: 'Delivery',
    meta: {
      title: 'Delivery',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'driver',
        component: () => import('@/views/permission/role'),
        name: 'driverDetails',
        meta: {
          title: 'Driver Details',
          roles: ['admin']
        }
      },
      {
        path: 'pickupOrders',
        component: () => import('@/views/permission/page'),
        name: 'pickupOrders',
        meta: {
          title: 'pickup Orders',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
   
      
     
     
      {
        path: 'ShowItems',
        component: () => import('@/views/permission/ShowItems'),
        name: 'Showitems',
        meta: {
          title: 'Show items',
          roles: ['admin']
        }
      },
    
     
    

          
    ]
  },

  

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/warehouse',
    component: Layout,
    redirect: '/example/list',
    name: 'warehouse',
    meta: {
      title: 'warehouse',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'warehouseOrders',
        component: () => import('@/views/permission/warehouseOrders'),
        name: 'warehouseOrders',
        meta: {
          title: 'Warehouse Orders',
          roles: ['admin']
        }
      },
      {
        path: 'warehouseItems',
        component: () => import('@/views/permission/warehouseItems'),
        name: 'warehouseItems',
        meta: {
          title: 'Warehouse Items',
          roles: ['admin']
        }
      },
      {
        path: 'assignOrders',
        component: () => import('@/views/permission/assignOrders'),
        name: 'assignOrders',
        meta: {
          title: 'Assign Orders',
          roles: ['admin']
        }
      },
    
    ]
  },



  {
    path: '/retailShop',
    component: Layout,
    redirect: 'noRedirect',
    name: 'retailShop',
    meta: {
      title: 'retail Shop',
      icon: '404'
    },
    children: [
      {
        path: 'viewOrderDetails',
        component: () => import('@/views/permission/viewOrderDetails'),
        name: 'viewOrderDetails',
        meta: {
          title: 'viewOrderDetails',
          roles: ['admin']
        }
      },
      {
        path: 'retailShopDetails',
        component: () => import('@/views/permission/retailShopDetails'),
        name: 'retailShopDetails',
        meta: { 
          title: 'Retail Shop Details',
          roles: ['admin']
        }

      },
      {
        path: 'RetailSOrders',
        component: () => import('@/views/permission/RetailSOrders'),
        name: 'RetailSOrders',
        meta: {
          title: 'RetailS Orders',
          roles: ['admin']
        }
      },
  
    ]
  },


  

  

  

  

  

 
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
