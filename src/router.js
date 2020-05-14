// import Vue from 'vue'
// import Router from 'vue-router'
// // import Home from './views/Home.vue'

// Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'redirect',
//       redirect: '/ebook',
//       component: () => import('@/views/ebook')
//     },
//     // {
//     //   path: '/bookReader/:id',
//     //   // redirect: '/ebook',
//     //   name: 'bookReader',
//     //   component: () => import( './views/ebook/data.vue')
//     // },
//     {
//       path: '/ebook',
//       name: 'ebook',
//       // route level code-splitting
//       // this generates a separate chunk (about.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('@/views/ebook'),
//       children: [
//         {
//           path: '/ebook/deep',
//           name: 'bookReader',
//           component: () => import('@/components/EbookReader')
//         }
//       ]
//     }
//   ]
// })
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    // {
    //   path: '/ebooker/:id',
    //   // redirect: '/ebook',
    //   name: 'bookReaderss',
    //   component: () => import('@/views/ebook/data.vue')
    // },
    {
      path: '/ebook',
      component: resolve => require(['@/views/ebook/index.vue'], resolve),
      children: [
        {
          path: ':fileName', // 根据输入的路径的不同动态显示内容
          name: 'ebookFileName',
          component: resolve => require(['@/components/ebook/EbookReader.vue'], resolve)
        }
        // {
        //   path: 'ebook/:id', // 根据传☞的不同
        //   // redirect: '/ebook',
        //   name: 'bookReader',
        //   component: () => import('@/views/ebook/data.vue')
        // }
      ]
    },
    {
      path: '/store',
      redirect: '/store/home',
      component: resolve => require(['@/views/store/index.vue'], resolve),
      children: [
        {
          path: '/store/home', // 根据输入的路径的不同动态显示内容
          name: 'storeHome',
          component: resolve => require(['@/views/store/storeHome.vue'], resolve)
        }
        // {
        //   path: 'ebook/:id', // 根据传☞的不同
        //   // redirect: '/ebook',
        //   name: 'bookReader',
        //   component: () => import('@/views/ebook/data.vue')
        // }
      ]
    }
    // {
    //   path: '/book-store',
    //   component: resolve => require(['@/views/store/index.vue'], resolve),
    //   redirect: '/book-store/shelf',
    //   children: [
    //     {
    //       path: '/book-store/shelf',
    //       component: resolve => require(['@/views/store/bookShelf.vue'], resolve),
    //       meta: { key: 1 }
    //     },
    //     {
    //       path: '/book-store/category',
    //       component: resolve => require(['@/views/store/bookCategory.vue'], resolve),
    //       meta: { key: 2 }
    //     },
    //     {
    //       path: '/book-store/home',
    //       component: resolve => require(['@/views/store/bookHome.vue'], resolve),
    //       meta: { key: 3 }
    //     },
    //     {
    //       path: '/book-store/list',
    //       component: resolve => require(['@/views/store/bookList.vue'], resolve),
    //       meta: { key: 4 }
    //     },
    //     {
    //       path: '/book-store/detail',
    //       component: resolve => require(['@/views/store/bookDetail.vue'], resolve),
    //       meta: { key: 5 }
    //     },
    //     {
    //       path: '/book-store/book-speaking',
    //       component: resolve => require(['@/views/store/bookSpeaking.vue'], resolve),
    //       meta: { key: 6 }
    //     }
    //   ]
    // }
  ]
})
