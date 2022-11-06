import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'

// 改变大小和拖动
import VueDragResize from 'vue-drag-resize'

// echarts
import "echarts";
import ECharts from 'vue-echarts'

// 右键菜单
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

// element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// tab拖拽


const app = createApp(App)


app.component('dragger', VueDragResize)
app.component('Echarts', ECharts)
app.use(router)
app.use(ContextMenu)
app.use(ElementPlus)

app.mount('#app')
