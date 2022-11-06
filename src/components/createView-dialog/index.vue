<template>
  <div class="createView" v-if="visibel">
    <div class="createView_show">
      <div
        :style="{
          width: data.viewConfig.width + 'px',
          height: data.viewConfig.height + 'px',
          backgroundColor: data.viewConfig.bgcolor,
          transform: 'scale(0.6)',
        }"
      ></div>
    </div>
    <div class="createView_edit">
      <el-form label-width="100px" :model="data.viewConfig" style="max-width: 460px">
        <el-form-item label="标题">
          <el-input type="text" size="large" v-model="data.viewConfig.name"> </el-input>
        </el-form-item>
        <el-form-item label="选择尺寸">
          <el-select
            v-model="data.selectscreen"
            class="m-2"
            placeholder="Select"
            size="large"
          >
            <el-option
              v-for="item in data.screenList"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            >
              <span class="option" style="margin-right: 50px">{{ item.label }}</span>
              <span style="float: right">({{ item.width + "x" + item.height }})</span>
            </el-option>
            <el-option key="自定义" label="自定义" value="自定义">自定义</el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="宽度">
          <el-input v-model="data.viewConfig.width" :disabled="data.isCustom"></el-input>
        </el-form-item>

        <el-form-item label="高度">
          <el-input v-model="data.viewConfig.height" :disabled="data.isCustom"></el-input>
        </el-form-item>

        <el-form-item label="填充">
          <el-color-picker v-model="data.viewConfig.bgcolor" />
        </el-form-item>
      </el-form>
      <ElButton class="create_View_Btn" type="primary" @click="newView">创建</ElButton>
    </div>
    <div class="close" @click="() => emit('closeCreateDiolog')">
      <img src="/close.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { number } from "echarts";
import { ElMenuItem, ElMessage } from "element-plus";
import { isEmpty } from "lodash";
import { onMounted, reactive, watch, defineEmits } from "vue";
import * as screenData from "../../constants/screen-sizeconfig";
let emit = defineEmits(["newView", "closeCreateDiolog"]);
let props = defineProps({
  visibel: {
    type: Boolean,
    default: false,
  },
});
onMounted(() => {});
const data = reactive({
  screenList: screenData.SCREEN, //屏幕大小数据
  selectscreen: "iPhnoe XR",
  viewConfig: {
    name: "默认标题",
    width: 10,
    height: 10,
    bgcolor: "#ffffff",
  },
  isCustom: false,
  pageId: 1,
});

watch(
  data,
  (newvalue, oldvalue) => {
    data.selectscreen == "自定义" ? (data.isCustom = false) : (data.isCustom = true);

    if (newvalue.selectscreen != "自定义") {
      let newscreen: any = data.screenList.filter(
        (i: any) => i.label == newvalue.selectscreen
      )[0];
      data.viewConfig.width = newscreen.width;
      data.viewConfig.height = newscreen.height;
    }
  },
  { immediate: true }
);

// 新建
const newView = () => {
  let { name, width, height } = data.viewConfig;
  if (isEmpty(name) || isEmpty(width) || isEmpty(height) || width == 0 || height == 0) {
    return ElMessage.error("信息输入有误，请检查后重试！");
  }
  emit("newView", data.viewConfig);
};
</script>

<style scoped lang="less">
.createView {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 60vw;
  height: 60vh;
  background-color: white;
  border: 3px solid rgb(207, 207, 207);
  z-index: 99;
  border-radius: 20px;
  display: flex;
  overflow: hidden;
  box-shadow: 5px 5px 8px 0px rgb(186, 186, 186);
  .createView_show {
    width: 70%;
    height: 100%;
    background-color: rgb(225, 225, 225);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .createView_edit {
    padding: 1rem;
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .create_View_Btn {
      position: relative;
      bottom: 3rem;
      width: 300px;
      height: 60px;
      transition: 0.2s;
    }
  }
  .close {
    position: absolute;
    margin: 1rem;
    border-radius: 30px;
    transition: 0.3s;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
      transform: rotate(90deg);
    }
  }
}
</style>
