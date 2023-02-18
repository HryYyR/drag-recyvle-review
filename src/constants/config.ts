import * as dft from './default'
import * as styleFormConfig from './style-form-config'

// 组件列表的配置项
export const WIDGET_LIST = [
    {
        type: "button",
        component: 'CustomBtn',
        label: "按钮",
        default: dft.CUSTOM_BTN,
        styleForm: styleFormConfig.BTN,
        style: {
            value: '默认按钮',
            color:'#ffffff',
            bgColor:'#87ceeb',
            fontSize: 18,
            opacity: 1,
            borderRadius:10,
            border:0,
            borderColor:'#000000',
            width:'100%',
            height:'100%'
        }
    },
    {
        type: "text",
        component: "CustomText",
        label: "文本",
        default: dft.CUSTOM_TEXT,
        style: {
            value: '默认文本',
            color: '#000000',
            fontSize: 24,
            opacity: 1,
            bgColor: '',
            padding:1,
            margin:0,

        },
        styleForm: styleFormConfig.TEXT
    },
    {
        type: "input",
        component: "CustomInput",
        label: "输入框",
        default: dft.CUSTOM_INPUT,
        style: {
            value: '默认输入框',
            color:'rgb(201,204,210)',
            bgColor:'#fff',
            fontSize: 14,
            opacity: 1,
            borderRadius:3,
            border:2,
            borderColor:'rgb(121,187,255)',
            width:'100%',
            height:'100%',
            padding:0,
            margin:0,
            iconSize:30
        },
        styleForm: styleFormConfig.INPUT
    },
    {
        type: "searchText",
        component: "CustomSearch",
        label: "搜索框",
        default: dft.CUSTOM_SEARCH_INPUT,
        style: {
            value: '默认搜索框',
            color:'rgb(201,204,210)',
            bgColor:'#fff',
            fontSize: 16,
            opacity: 1,
            borderRadius:6,
            border:2,
            borderColor:'rgb(135,206,235)',
            width:'100%',
            height:'100%',
            padding:1,
            margin:0,
            iconSize:30
        },
        styleForm: styleFormConfig.SEARCH
    },
    {
        type: "video",
        component: "Customvideo",
        label: "视频",
        default: dft.CUSTOM_VIDEO,
        styleForm: styleFormConfig.VIDIO,
        style: {
            value: '默认视频',
            ctrlLoop: true
        }
    },
    {
        type: "area-chart",
        component: "AreaChart",
        label: "面积图",
        default: dft.AREA_CHART,
        style: {
            value: '默认面积图',
            xdata:"[\"Mon\",\"Tue\",\"Wed\"]",
            ydata:"[100,300,200]",
            areaColor: '#ff0000',
            lineColor: '#0000ff',
            xAxisVisible: true,
            yAxisVisible: true,
            titleVisible: true,
        },
        styleForm: styleFormConfig.AREA_CHART
    },
    {
        type: "bar-chart",
        component: "BarChart",
        label: "柱状图",
        default: dft.BAR_CHART,
        style:{
            value: '默认柱状图',
            xdata:"[\"Mon\",\"Tue\",\"Wed\"]",
            ydata:"[100,300,200]",
            Color:"rgba(64,158,255,1)",
            bgColor:"rgba(0,0,0,0.2)",
            bgColorVisible:true,
            xAxisVisible: true,
            yAxisVisible: true,
            titleVisible: true,
        },
        styleForm: styleFormConfig.BAR_CHART
    },

]