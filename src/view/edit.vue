<template>
  <div class="edit">
    <!-- 组件区 -->
    <div
      class="widgetview"
      :style="{
        filter: data.isvisibelCreateDiolog ? 'blur(5px)' : 'none',
        transition: '0.5s',
      }"
    >
      <el-tabs
        v-model="data.widgetName"
        tabPosition="left"
        class="tabs"
        type="border-card"
        stretch
      >
        <el-tab-pane label="工具" name="tool">
          <toolList />
        </el-tab-pane>
        <el-tab-pane label="组件" name="widget">
          <widgetList :list="data.WidgetList" @OnWidgetMouseDown="OnWidgetMouseDown" />
        </el-tab-pane>
        <el-tab-pane label="图层" name="layer">
          <div>
            <draggable
              v-model="data.list"
              group="people"
              @change="dropEndTablayer()"
              item-key="id"
              v-bind="data.tabOptions"
            >
              <template #item="{ element }">
                <div
                  @click="chooseTablayer(element)"
                  class="tabDraggable"
                  :class="{ 'tabDraggablebg ': element.focused }"
                >
                  <div>
                    {{ element.styles.value }}
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 视图区 -->
    <div
      :style="{
        filter: data.isvisibelCreateDiolog ? 'blur(5px)' : 'none',
        transition: '0.5s',
      }"
      class="showview"
      ref="showview"
      @mousedown="onmousedown($event)"
      @mouseup="onmouseup($event)"
      @mousemove="onmousemove($event)"
    >
      <div class="showview_nav">
        <div
          class="showview_nav_item"
          @click="changeToThisPage(item.id)"
          :style="{ backgroundColor: item.isfocus == true ? 'skyblue' : 'white' }"
          v-for="(item, index) in data.viewlist"
          :key="index"
        >
          <div>{{ item.name }}</div>
          <div class="showview_nav_item_closeBtn" @click="removeThisView(item.id)">
            <img src="/close.png" alt="" />
          </div>
        </div>
        <div class="showview_nav_more" @click="data.isvisibelCreateDiolog = true">+</div>
      </div>
      <div
        class="main_view"
        v-show="!data.isvisibelCreateDiolog"
        :style="{
          width: data.mainWidth + 'px',
          height: data.mainHeight + 'px',
          backgroundColor: data.viewConfig.bgColor,
          transform: `scale(${data.viewConfig.scale}) translate(${data.viewMoveConfig.viewTranslateX}px,${data.viewMoveConfig.viewTranslateY}px)`,
          position: 'relative',
        }"
        @dragover.prevent
        @drop="adddrag($event, -1)"
        @mousedown="mainViewMouseDown"
        @mouseup="mainViewMouseUp"
        @mousemove="mainViewMouseMove"
        ref="mainView"
      >
        <dragger
          :minw="80"
          :minh="30"
          :w="item.w"
          :h="item.h"
          :x="item.x"
          :y="item.y"
          :z="item.z"
          :parentScaleX="data.viewConfig.scale"
          :parentScaleY="data.viewConfig.scale"
          :stickSize="data.viewConfig.scale * 8"
          ref="widget"
          v-for="(item, index) in data.list"
          :key="item.id"
          :style="{ position: 'absolute' }"
          :isActive="item.focused"
          @contextmenu="onContextMenu($event, item)"
          @click="draggerOnClick($event, item)"
          @mouseup.native="dragMouseUp(index)"
          @dragging="(info:any)=>onWidgetDrap(info,item)"
          @dragstop="onWidgetDragStop"
          :preventActiveBehavior="false"
          :parentLimitation="true"
          :aspectRatio="item.aspectRatio"
        >
          <component
            class="inner-weiget"
            :style="{ width: '100%', height: '100%' }"
            :is="dom[item.component]"
            :value="item.value"
            :styles="item.styles"
            @drop.stop="adddrag($event, index)"
          />
        </dragger>

        <!-- 对齐线 -->
        <div
          class="standard-y-line"
          v-if="data.XstandarLineVisibel"
          :style="{
            transform: ` translateX(${data.XstandarLine}px)`,
          }"
        ></div>
        <div
          class="standard-x-line"
          v-if="data.YstandarLineVisibel"
          :style="{
            transform: ` translateY(${data.YstandarLine}px)`,
          }"
        ></div>

        <!-- 框选 -->
        <div
          class="frame"
          v-if="data.frame.frameVisible"
          :style="{
            width: `${data.frame.w}px`,
            height: `${data.frame.h}px`,
            transform: `translate(${data.frame.x}px,${data.frame.y}px)`,
          }"
        ></div>
      </div>
    </div>

    <!-- 编辑区 -->
    <styleSider
      :style="{
        filter: data.isvisibelCreateDiolog ? 'blur(5px)' : 'none',
        transition: '0.5s',
      }"
      class="editview"
      @withdraw="withdraw()"
      @recoverdraw="recoverdraw()"
      @change="onChangeStyle"
      @changeScreen="changeScreen"
      @changeBgColor="changeBgColor"
      @exportHTML="exportPNG"
      @changeDirection="changeDirection"
      :current="getNowEditFocused()"
      :currentForm="getNowEditForm()"
      :screenData="data.screenData"
      :viewConfig="data.viewConfig"
      :direction="data.currentViewdirection"
    />

    <createViewDiolog
      @new-view="addPage"
      @close-create-diolog="data.isvisibelCreateDiolog = false"
      :visibel="data.isvisibelCreateDiolog"
      :pageId="pageId"
    />
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  shallowRef,
  ref,
  nextTick,
  watch,
} from "vue";

// compoment
import createViewDiolog from "../components/createView-dialog/index.vue";
import widgetList from "../components/widget-list/index.vue";
import styleSider from "../components/style-sider/index.vue";
import toolList from "../components/tool-list/index.vue";
import * as widgetListConfig from "../constants/config";
import * as screenData from "../constants/screen-sizeconfig";

// 组件
import AreaChart from "../components/widget/area-chart.vue";
import BarChart from "../components/widget/bar-chart.vue";
import CustomText from "../components/widget/custom-text.vue";
import Customvideo from "../components/widget/custom-video.vue";
import CustomInput from "../components/widget/cutom-input.vue";
import CustomBtn from "../components/widget/cutom-btn.vue";
import CustomSearch from "../components/widget/custom-search.vue";

// ui
import ContextMenu from "@imengyu/vue3-context-menu"; //右键菜单
import { ElMessage, ElMessageBox } from "element-plus";

//插件
import draggable from "vuedraggable";
import { cloneDeep, isEqual, random } from "lodash";
import html2Canvas from "html2canvas";

// 注册组件用于compoment切换
let dom: any = shallowRef({
  AreaChart: AreaChart,
  BarChart: BarChart,
  CustomText: CustomText,
  Customvideo: Customvideo,
  CustomInput: CustomInput,
  CustomBtn: CustomBtn,
  CustomSearch: CustomSearch,
  draggable: draggable,
});

type viewtype = {
  id: number;
  name: string;
  list: Array<any>;
  viewConfig: {
    scale: number;
    bgColor: string;
    mainWidth: number;
    mainHeight: number;
    direction: number;
  };
  isfocus: boolean;
};

// 数据
let data = reactive({
  listLength: 0,
  mainWidth: 414, //视图宽度
  mainHeight: 896, //视图高度
  WidgetList: widgetListConfig.WIDGET_LIST, //组件列表
  screenData: screenData.SCREEN, //屏幕大小数据
  list: <any>[], //默认画布里的组件
  viewlist: <any>[], //用于保存多个视图
  currentViewId: 0, //当前显示的视图id
  currentViewdirection: 1, //当前显示的视图方向

  widgetName: "widget", //默认选中面板
  tabOptions: {
    //图层参数
    animation: 200,
  },
  handleViewAbel: {
    //撤回和恢复的键盘事件
    withdraw: true,
    recoverdraw: true,
  },
  isClickSpace: false, //是否按下空格
  isPressMouseLeft: false, //是否按下鼠标左键
  // 用于记录按下鼠标左键时的鼠标位置
  viewMoveConfig: {
    mouseDownX: 0,
    mouseDownY: 0,
    viewTranslateX: 0, //视图X偏移量
    viewTranslateY: 0, //视图Y偏移量
    preX: 0,
    preY: 0,
  },

  YstandarLineVisibel: false, //Y轴辅助线
  YstandarLine: 0,
  XstandarLineVisibel: false, //X轴辅助线
  XstandarLine: 0,
  frame: {
    //框选的参数
    clientx: 0,
    clienty: 0,
    frameVisible: false,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
  },
  multiable: false, //是否可以多选
  isvisibelCreateDiolog: false, //是否显示创建视图页面
  // 视图配置
  viewConfig: {
    bgColor: "#ffffff",
    scale: 1,
  },
});
// let WidgetList = widgetListConfig.WIDGET_LIST
watch(data.WidgetList, (newvalue, oldvalue) => {
  console.log(newvalue, oldvalue);
  data.WidgetList = oldvalue;
});

// 监听页面是否有视图
watch(
  data.viewlist,
  (newvalue, oldvalue) => {
    newvalue.length == 0
      ? (data.isvisibelCreateDiolog = true)
      : (data.isvisibelCreateDiolog = false);
  },
  { immediate: true }
);
onMounted(() => {
  window.addEventListener("keyup", (e) => listenKeyup(e));
  window.addEventListener("keydown", (e) => listenKeydown(e));
  showview.value &&
    showview.value.addEventListener("mousewheel", (e: any) => listenMousewheel(e));
});
onBeforeUnmount(() => {
  window.removeEventListener("keyup", (e) => listenKeyup(e));
  window.removeEventListener("keydown", (e) => listenKeydown(e));
  window.removeEventListener("mousewheel", (e) => listenMousewheel(e));
});
let currentId: number = 0; //编号
let widgetX: number = 0; //鼠标拖拽组件时获取的x坐标
let widgetY: number = 0; //鼠标拖拽组件时获取的y坐标
// let currentWidget: any = null;
let currentWidget: any = null; //当前选中的组件

// 视图dom
let mainView: any = ref();
let showview: any = ref();
let widget: any = ref(""); //所有组件的实例

watch(data.list, (newvalue, oldvalue) => {
  data.listLength = data.list.length;
});

let pageId: number = 0; //新建页面编号
// 添加或者新建一个页面
const addPage = (viewConfig?: any) => {
  let { name, width, height, bgcolor } = viewConfig;

  data.isvisibelCreateDiolog = false;

  data.viewlist.length != 0 && saveViewConfig();
  data.viewlist.map((item: any) => {
    item.isfocus = false;
  });

  pageId++;
  let config: viewtype = {
    id: pageId,
    name: name || `原型${pageId}`,
    list: [],
    viewConfig: {
      scale: 1,
      bgColor: bgcolor || "#ffffff",
      mainWidth: width == 1 ? 414 : width,
      mainHeight: height == 1 ? 896 : height,
      direction: 1,
    },
    isfocus: true,
  };
  data.viewlist.push(config);
  data.currentViewId = pageId;
  // 渲染新增的base页面
  data.list = [];
  (data.mainHeight = height == 1 ? 896 : height),
    (data.mainWidth = width == 1 ? 414 : width),
    (data.viewConfig.scale = 1);
  data.viewConfig.bgColor = bgcolor || "#ffffff";
};

// 切换页面
const changeToThisPage = (id: number) => {
  data.viewlist.map((item: any) => {
    item.isfocus = false;
  });
  saveViewConfig();

  // 获取newvalue
  let newView = getAssignView(id);
  newView.isfocus = true;
  data.currentViewId = newView.id;

  //  渲染newvalue的数据
  data.list = newView.list;
  data.viewConfig.scale = newView.viewConfig.scale;
  data.viewConfig.bgColor = newView.viewConfig.bgColor;
  data.mainWidth = newView.viewConfig.mainWidth;
  data.mainHeight = newView.viewConfig.mainHeight;
};
// 保存当前视图的数据
const saveViewConfig = () => {
  let { viewConfig } = getAssignView();

  let datalist = data.list;
  let scale = data.viewConfig.scale;
  let bgcolor = data.viewConfig.bgColor;
  let mainWidth = data.mainWidth;
  let mainHeight = data.mainHeight;

  getAssignView().list = datalist;
  viewConfig.scale = scale;
  viewConfig.bgColor = bgcolor;
  viewConfig.mainWidth = mainWidth;
  viewConfig.mainHeight = mainHeight;
};
// 获取指定view配置数据
const getAssignView = (id: number = data.currentViewId) => {
  let view = data.viewlist.filter((i: any) => i.id == id)[0];
  return view;
};
// 删除当前视图
const removeThisView = (id: number) => {
  ElMessageBox.confirm("确认删除这个视图？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      data.viewlist.length <= 1 && (data.viewlist = []);
      data.viewlist.forEach((i: any, index: number) => {
        if (i.id == id) {
          index == 0
            ? changeToThisPage(data.viewlist[index + 1].id)
            : changeToThisPage(data.viewlist[index - 1].id);
          data.viewlist.splice(index, 1);
        }
      });
      ElMessage.success("删除成功！");

      data.viewlist.length == 0 && (data.isvisibelCreateDiolog = true);
    })
    .catch((e) => {});
};

// 导出为PNG
const exportPNG = async () => {
  data.viewConfig.scale = 1;

  // 解决异步问题
  setTimeout(() => {
    const ele: HTMLElement | null = mainView.value;
    html2Canvas(ele as HTMLElement).then((canvas: any) => {
      const imgUrl = canvas.toDataURL("image/png");
      const tempLink = document.createElement("a"); // 创建一个a标签
      tempLink.style.display = "none";
      tempLink.href = imgUrl;
      tempLink.setAttribute("download", `${Math.floor(Math.random() * 9999999)}`); // 给a标签添加下载属性
      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }
      document.body.appendChild(tempLink); // 将a标签添加到body当中
      tempLink.click(); // 启动下载
      document.body.removeChild(tempLink); // 下载完毕删除a标签
      window.URL.revokeObjectURL(imgUrl);
    });
  }, 1000);
};

// 视图被鼠标按下时
const mainViewMouseDown = (e: MouseEvent) => {
  data.viewMoveConfig.mouseDownX = e.clientX;
  data.viewMoveConfig.mouseDownY = e.clientY;
  // console.log("mainViewMouseDown", e);
  if (e.which == 1) {
    data.isPressMouseLeft = true;
    return;
  }
};

// 视图被鼠标抬起时
const mainViewMouseUp = (e: MouseEvent) => {
  const { viewTranslateX, viewTranslateY } = data.viewMoveConfig;
  data.viewMoveConfig.preX = viewTranslateX;
  data.viewMoveConfig.preY = viewTranslateY;
  // console.log("mainViewMouseUp", e);
};
// 在视图中鼠标移动时
const mainViewMouseMove = (e: MouseEvent) => {
  if (data.isClickSpace == true && data.isPressMouseLeft == true) {
    let { mouseDownX, mouseDownY, preX, preY } = data.viewMoveConfig;

    data.viewMoveConfig.viewTranslateX =
      (e.clientX - mouseDownX + preX) / data.viewConfig.scale;
    data.viewMoveConfig.viewTranslateY =
      (e.clientY - mouseDownY + preY) / data.viewConfig.scale;
  }
};
// 添加组件到画布区,放置
const adddrag = (e: any, index: number) => {
  // console.log(currentWidget);
  let x = e.offsetX - widgetX;
  let y = e.offsetY - widgetY;

  // 判断是否drop在组件上
  if (index != -1) {
    // 获取被drop组件的dom
    const beencurrentWidget = widget.value && widget.value[index].$el;
    x = beencurrentWidget.offsetLeft + e.offsetX - widgetX; //被drop组件距离左边的距离 + 拖动组件距离被drop组件左边的距离 - 点击组件时的坐标
    y = beencurrentWidget.offsetTop + e.offsetY - widgetY;
  }

  // 把数据绑定解除
  let CurrentWidget = JSON.parse(JSON.stringify(currentWidget));

  data.list.push({
    id: currentId++,
    x: x,
    y: y,
    z: computedMaxIndex() + 1,
    w: CurrentWidget.default.w,
    h: CurrentWidget.default.h,
    label: CurrentWidget.label,
    component: CurrentWidget.component,
    focused: true, //是否选中
    value: CurrentWidget.default.value,
    styles: CurrentWidget.style,
    styleForm: CurrentWidget.styleForm,
    aspectRatio: false, //保持比例缩放
  });

  // 获取最新的组件
  const newedit = data.list.at(-1);
  setNowEditFocused(newedit);
  SortList();
  record();
};

let recordList: any = []; //记录用于撤回数据
let withdrawIndex = 1; //撤回坐标
let withdrawMaxIndex = 30; //最大保存操作数
// 记录每一步操作
const record = (info?: any) => {
  if (info) {
    let widget = getNowEditFocused();
    setNewList(widget, info);
  }
  recordList.push(cloneDeep(data.list));
  // console.log(recordList);

  if (recordList.length > withdrawMaxIndex) {
    recordList.splice(0, 1);
  }
};
// 撤回操作
const withdraw = async () => {
  if (withdrawIndex > recordList.length || withdrawIndex > withdrawMaxIndex - 1) {
    ElMessage.error(" 不能撤回的了");
    return;
  }
  withdrawIndex++;
  let len = recordList.length - withdrawIndex;
  let oldList = recordList[len] || []; //上一个数据
  data.list = oldList || [];
};
// 恢复操作
const recoverdraw = () => {
  if (withdrawIndex == 1) {
    ElMessage.error("没有可以恢复的了");
    return;
  }
  withdrawIndex--;
  let len = recordList.length - withdrawIndex;
  data.list = recordList[len] || [];
};

// mouseup用于记录
const dragMouseUp = (id: number) => {
  let current = data.list[id];
  let Widget = widget.value[0].rect;
  // console.log(current, Widget);
  if (
    current.w == Widget.width &&
    current.h == Widget.height &&
    current.x == Widget.left &&
    current.y == Widget.top
  ) {
    return;
  }
  // setNewList(current, Widget);
  // record();
};

//记录时调用，设置新的数据
const setNewList = async (widget: any, info: any) => {
  await nextTick(() => {
    widget.y = info.top;
  });
  await nextTick(() => {
    widget.w = info.width;
  });
  await nextTick(() => {
    widget.h = info.height;
  });
  await nextTick(() => {
    widget.w = info.width;
  });
};

// 切换当前视图方向
const changeDirection = (i: number) => {
  if (data.viewlist.length == 0) {
    return;
  }
  let view = getAssignView(data.currentViewId);
  if (i == view.viewConfig.direction) {
    return;
  }
  view.viewConfig.direction = i;
  data.currentViewdirection = i;

  data.mainWidth = parseInt(view.viewConfig.mainHeight);
  data.mainHeight = parseInt(view.viewConfig.mainWidth);

  let mid = view.viewConfig.mainWidth;
  view.viewConfig.mainWidth = view.viewConfig.mainHeight;
  view.viewConfig.mainHeight = mid;
};

// 鼠标按下组件区的组件时的事件
const OnWidgetMouseDown = (e: any, widget: any) => {
  // console.log(widget);
  widgetX = e.offsetX;
  widgetY = e.offsetY;
  currentWidget = widget;
};

// 组件点击事件
const draggerOnClick = (e: MouseEvent, item: any) => {
  setNowEditFocused(item);
  currentWidget = item;
};

// 右键打开菜单
const onContextMenu = (e: MouseEvent, item: any) => {
  setNowEditFocused(item);

  e.preventDefault();
  //shou our menu
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    items: [
      {
        label: "置顶",
        onClick: () => {
          const currentItem = getNowEditFocused();

          const maxZ = computedMaxIndex();
          if (maxZ == currentItem.z) {
            ElMessage.error("最高了");
            return;
          }
          // 当前选中的组件
          currentItem.z = maxZ + 1;
          SortList();
          record();
        },
      },
      {
        label: "置底",
        onClick: () => {
          // 当前选中的组件
          const currentItem = getNowEditFocused();
          const minZ = computedMinIndex();
          if (currentItem.z == minZ) {
            ElMessage.error("最低了");

            return;
          }

          if (minZ - 1 < 0) {
            data.list = data.list.map((item: any) => {
              item.z -= minZ - 1;
              return item;
            });
            currentItem.z = 0;
          } else {
            currentItem.z = minZ - 1;
          }
          SortList();
          record();
        },
      },
      {
        label: "上移图层",
        onClick: () => {
          const currentWidget = getNowEditFocused();
          if (currentWidget.z == computedMaxIndex()) {
            ElMessage.error("最高了");
            return;
          }
          const prevwieget = data.list.find((item: any) => item.z == currentWidget.z + 1);
          // console.log(prevwieget);
          prevwieget && prevwieget.z--;
          currentWidget.z++;
          SortList();
          record();
        },
      },
      {
        label: "下移图层",
        onClick: () => {
          const currentWidget = getNowEditFocused();
          if (currentWidget.z == computedMinIndex()) {
            ElMessage.error("最低了");

            return;
          }
          const nextwieget = data.list.find((item: any) => item.z == currentWidget.z - 1);
          // console.log(nextwieget);
          nextwieget && nextwieget.z++;
          currentWidget.z--;
          SortList();
          record();
        },
      },
      {
        label: "删除",
        onClick: () => {
          data.list.forEach((item: any, i: number) => {
            // focused为true就执行splice
            item.focused && data.list.splice(i, 1);
          });
          SortList();
          record();
        },
      },
    ],
  });
};

// 改变样式时触发
const onChangeStyle = (id: any, newstyle: any) => {
  data.list.forEach((item: any, i: number) => {
    if (item.id == id) {
      // console.log(item);
      item.styles = newstyle;
    }
    return item;
  });
};

// mouseup移动图层时触发
const dropEndTablayer = () => {
  let len = data.list.length;
  data.list.forEach((item: any, i: any) => {
    item.z = len - i;
  });
};
const chooseTablayer = (item: any) => {
  setNowEditFocused(item);
};

// 点击空白失去焦点
const onmousedown = (e: MouseEvent) => {
  if (e.target != mainView.value) {
    return;
  }
  if (data.isClickSpace == true) {
    return;
  }
  data.list &&
    data.list.forEach((item: any) => {
      item.focused = false;
    });

  // 重置宽高
  data.frame.w = 0;
  data.frame.h = 0;

  //获取框选初始位置
  data.frame.frameVisible = true;
  data.frame.x = e.offsetX;
  data.frame.y = e.offsetY;
  data.frame.clientx = e.clientX;
  data.frame.clienty = e.clientY;
};
// 用于记录框选范围
const onmousemove = (e: MouseEvent) => {
  if (!data.frame.frameVisible) {
    return;
  }
  data.frame.w = (e.clientX - data.frame.clientx) / data.viewConfig.scale;
  data.frame.h = (e.clientY - data.frame.clienty) / data.viewConfig.scale;

  data.list.map((item: any) => {
    if (itemIsIncludFrame(item)) {
      item.focused = true;
    } else {
      item.focused = false;
    }
  });
};

// 用于框选
const onmouseup = (e: MouseEvent) => {
  // 设置鼠标左键为false
  if (e.which == 1) {
    data.isPressMouseLeft = false;
  }

  // 获取被选中的组件
  const innerList = data.list.filter((item: any) => {
    return itemIsIncludFrame(item);
  });
  // 重置
  if (!innerList.length) {
    data.frame = {
      frameVisible: false,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      clientx: 0,
      clienty: 0,
    };
  } else {
    const xmin = Math.min(...innerList.map((item: any) => item.x));
    const ymin = Math.min(...innerList.map((item: any) => item.y));
    // 框选
    data.frame = {
      frameVisible: true,
      x: xmin,
      y: ymin,
      w: Math.max(...innerList.map((item: any) => item.w + item.x)) - xmin,
      h: Math.max(...innerList.map((item: any) => item.h + item.y)) - ymin,
      clientx: data.list.clientx,
      clienty: data.list.clienty,
    };
  }
};
// 用于框选判断组件是否在框内
const itemIsIncludFrame = (item: any) => {
  let boonlne = !(
    item.y > data.frame.y + data.frame.h ||
    item.x > data.frame.x + data.frame.w ||
    data.frame.y > item.y + item.h ||
    data.frame.x > item.x + item.w
  );
  return boonlne;
};

// 获取当前选中组件
const getNowEditFocused = () => {
  return data.list.find((item: any) => item.focused == true);
};

// 设置当前选中组件
const setNowEditFocused = (item: any) => {
  if (!data.multiable) {
    data.list.forEach((i: any) => {
      i.focused = false;
    });
  }
  item.focused = true;
};

// 获取当前选中组件的样式列表
const getNowEditForm = () => {
  let edit = getNowEditFocused();
  if (!edit) {
    return [];
  }
  let form = data.WidgetList.find((item: any) => item.component == edit.component)
    ?.styleForm;
  return form;
};

// 获取最高层级
const computedMaxIndex = () => {
  if (data.list.length == 0) {
    return 0;
  }
  let list = data.list;
  let Zlist = list.map((item: any) => item.z);
  return Math.max(...Zlist);
};

// 获取最低层级
const computedMinIndex = () => {
  if (data.list.length == 0) {
    return 0;
  }
  let list = data.list;
  let Zlist = list.map((item: any) => item.z);
  return Math.min(...Zlist);
};

// 对画布里的组件进行排序
const SortList = () => {
  data.list.sort((a: any, b: any) => a.z - b.z);
};

// 监听键盘up事件
const listenKeyup = (e: KeyboardEvent) => {
  if (e.key == "Shift") {
    data.list.map((item: any) => {
      item.aspectRatio = false;
      return item;
    });
  }
  if (e.key == "Control") {
    data.multiable = false;
  }
  if (e.code == "Space") {
    document.body.style.cursor = "default";
    data.isClickSpace = false;
  }
  if (e.ctrlKey == true && e.key == "z") {
    withdraw();
  }
  if (e.ctrlKey == true && e.key == "y") {
    recoverdraw();
  }
};
// 监听键盘down事件
const listenKeydown = (e: KeyboardEvent) => {
  if (e.shiftKey == true) {
    data.list.map((item: any) => {
      item.aspectRatio = true;
      return item;
    });
  }
  if (e.key == "Control") {
    data.multiable = true;
  }

  if (e.key == "Delete") {
    data.list = data.list.filter((item: any) => item.focused == false);
    SortList();
    record();
  }
  if (e.code == "Space") {
    document.body.style.cursor = "url(/press.ico),auto";
    data.isClickSpace = true;
  }
};

//鼠标滚轮
const listenMousewheel = (e: any) => {
  if (data.viewConfig.scale < 0.3) {
    if (e.deltaY < 0) {
      data.viewConfig.scale += 0.05;
    }
    return;
  }

  if (data.viewConfig.scale > 10) {
    if (e.deltaY > 0) {
      data.viewConfig.scale -= 0.05;
    }
    return;
  }

  if (e.deltaY < 0) {
    data.viewConfig.scale += 0.05;
  } else {
    data.viewConfig.scale -= 0.05;
  }
};

//拖拽时显示辅助线
const onWidgetDrap = (info: any, item: any) => {
  let { left: x, top: y, width: w, height: h } = info;
  let { scale } = data.viewConfig;
  item.x = x;
  item.y = y;
  item.w = w;
  item.h = h;

  const x0 = x + w / 2;
  const y0 = y + h / 2;
  for (const widget of data.list) {
    if (widget.id == item.id) {
      continue;
    }
    let x00 = widget.x + widget.w / 2;
    // X中线
    if (Math.abs(x0 - x00) < 3) {
      data.XstandarLineVisibel = true;
      data.XstandarLine = x0;
      break;
    }
    // X左对齐
    if (Math.abs(item.x - widget.x) < 3) {
      data.XstandarLineVisibel = true;
      data.XstandarLine = item.x;
      break;
    }
    // X右对齐
    let ix = item.x + item.w;
    let wx = widget.x + widget.w;
    if (Math.abs(ix - wx) < 3) {
      data.XstandarLineVisibel = true;
      data.XstandarLine = ix;
      break;
    }
    // Y中线
    let y00 = widget.y + widget.h / 2;
    if (Math.abs(y0 - y00) < 3) {
      data.YstandarLineVisibel = true;
      data.YstandarLine = y0;
      break;
    }
    // Y上对齐
    if (Math.abs(item.y - widget.y) < 3) {
      data.YstandarLineVisibel = true;
      data.YstandarLine = item.y;
      break;
    }
    // Y下对齐
    let iy = item.y + item.h;
    let wy = widget.y + widget.h;
    if (Math.abs(iy - wy) < 3) {
      data.YstandarLineVisibel = true;
      data.YstandarLine = iy;
      break;
    }

    data.XstandarLineVisibel = false;
    data.YstandarLineVisibel = false;
    data.XstandarLine = 0;
    data.YstandarLine = 0;
  }
};

const onWidgetDragStop = () => {
  data.XstandarLineVisibel = false;
  data.YstandarLineVisibel = false;
  data.XstandarLine = 0;
  data.YstandarLine = 0;
};

const changeScreen = (val: any) => {
  data.mainHeight = val.height;
  data.mainWidth = val.width;
};

const changeBgColor = (val: string) => {
  data.viewConfig.bgColor = val;
};
</script>

<style scoped lang="less">
@import "./index.less";
</style>
