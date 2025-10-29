import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../App.vue'),
    },
  ],
  history: createWebHistory(),
})

router.beforeEach((_to: any, _from, next) => {
  NProgress.start()
  next();
});

router.afterEach(() => {
  NProgress.done()
})

export default router
