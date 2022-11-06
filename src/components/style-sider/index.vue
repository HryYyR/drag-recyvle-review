<template>
  <el-tabs v-model="data.styleName" class="tabs editView" type="border-card" stretch>
    <el-tab-pane label="视图" name="view">
      <el-form label-width="100px" :model="data.viewconfig" style="max-width: 460px">
        <el-form-item label="选择尺寸">
          <el-select
            v-model="data.selectscreen"
            placeholder="Select"
            @change="changeScreen"
          >
            <el-option
              v-for="item in screenData"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              class=""
            >
              <span style="margin-right: 50px">{{ item.label }}</span>
              <span style="float: right">({{ item.width + "x" + item.height }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填充">
          <el-color-picker
            v-model="data.viewconfig.bgColor"
            @change="() => emit('changeBgColor', data.viewconfig.bgColor)"
        /></el-form-item>
        <el-form-item label="画布缩放">
          <!-- <el-input v-model="data.viewconfig.scale"></el-input> -->
          {{ Math.round(Math.floor(data.viewconfig.scale * 100) * 100) / 100 + "%" }}
        </el-form-item>
        <el-form-item label="方向">
          <el-button
            :type="direction == 1 ? '' : 'primary'"
            @click="() => emit('changeDirection', 0)"
            >横向</el-button
          >
          <el-button
            :type="direction == 1 ? 'primary' : ''"
            @click="() => emit('changeDirection', 1)"
            >纵向</el-button
          >
        </el-form-item>
      </el-form>

      <div class="handleView">
        <div @click="(e) => emit('withdraw')">撤回</div>
        <div @click="(e) => emit('recoverdraw')">恢复</div>
      </div>

      <div>
        <el-button type="primary" class="exportHTML" @click="() => emit('exportHTML')"
          >导出为PNG</el-button
        >
      </div>
    </el-tab-pane>
    <el-tab-pane label="样式" name="style">
      <el-form label-width="100px" :model="data.styleFormData" style="max-width: 460px">
        <el-form-item
          :label="formItem.label"
          v-for="(formItem, index) in data.styleFormData"
          :key="formItem.key"
        >
          <component
            :is="formItem.component"
            v-model="data.styleData.styles[formItem.key]"
            show-alpha
            :predefine="predefineColors"
          />
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { number } from "echarts";
import {
  reactive,
  defineProps,
  onMounted,
  nextTick,
  watch,
  shallowRef,
  shallowReactive,
  ref,
  defineEmits,
  watchEffect,
} from "vue";
const emit = defineEmits(["change", "withdraw", "recoverdraw",'changeScreen','changeBgColor','exportHTML','changeDirection']);
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
])
type screentype = {label:string,width:string,height:string};
// prop
const props = defineProps({
  current: {
    type: Object,
    default: {},
  },
  currentForm: {
    type: Array,
    default: [],
  },
  screenData: {
    type:  Array<screentype>,
    default: [],
  },
  viewConfig:{
     type:  Object,
    default: {},
  },
  direction:{
    type: Number,
    default:1
  }

});

// data
const data = reactive({
  styleName: "view",
  // styleName: "style",
  styleData: <any>{}, //组件的style
  styleFormData: <any>[], //设置style的组件数据
  selectscreen:'iPhnoe XR',
  viewconfig:<any>{
    bgColor:'#ffffff',
    scale:1
  }
});
let formdata: any;
watch(props, (newValue, oldValue) => {
  formdata = newValue.current;
  data.styleData = formdata;
  data.styleFormData = props.currentForm;
  data.viewconfig = props.viewConfig



Object.keys(data.styleData).length ? data.styleName='style':data.styleName='view'


});
watch(
  () => data.styleData,
  (newvalue, oldvalue) => {
    emit("change", data.styleData.id, data.styleData.styles);
  }
);
const changeScreen = (val:any)=>{
 emit('changeScreen',props.screenData.find((item:any)=>item.label ==val))
}
</script>

<style scoped lang="less">
.handleView {
  display: flex;
  margin-top: 50px;
  & div {
    cursor: pointer;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    height: 50px;
    margin: 0.3rem;
    transition: 0.3s;
    border-radius: 5px;
    &:hover {
      background-color: rgb(64, 158, 255);
    }
  }
}
.exportHTML {
  position: relative;
  margin-top: 50px;
  width: 100%;
  height: 40px;
}
</style>
