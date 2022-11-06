import { createRouter, createWebHashHistory } from 'vue-router'   // 使用插件可以不加这个
import index from '../view/index.vue'
import edit from '../view/edit.vue'

const routes = [
    { path: '/',  redirect: '/edit' },
    { path: '/index', name:"index",component: index },
    { path: '/edit',name:"edit", component: ()=>import("../view/edit.vue") },
    { path: '/preview',name:"preview", component: ()=>import("../view/preview.vue") },
]

const router = createRouter({
    history: createWebHashHistory(),  // 
    routes,
})

export default router
