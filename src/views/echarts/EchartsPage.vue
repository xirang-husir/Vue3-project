<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import {
  useManageStore,
  useStudentStore,
  useTeacherStore,
  useCategoriesStore
} from '@/stores'
import { ref } from 'vue'
const loading = ref(true)
// 模拟加载效果
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 750)
})
//声明周期函数，自动执行初始化
onMounted(() => {
  init()
  initLine()
})

const manageList = useManageStore().getManageList()
const studentList = useStudentStore().getLocalStudentList()
const teacherList = useTeacherStore().getLocalTeacherList()
const categoriesList = useCategoriesStore().getLocalCategory()
const categoriesListNum = ref(0)
const dataList = ref([])
for (let i = 0; i < categoriesList.length; i++) {
  categoriesListNum.value += categoriesList[i].subcategory_name.length
  dataList.value.push({
    name: categoriesList[i].category_name,
    value: manageList.filter(
      (item) => item.workCategory == categoriesList[i].category_name
    ).length
  })
}

function initLine() {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById('main1'))
  // 绘制图表
  let options = {
    title: {
      text: '历年参赛人数',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      data: ['2016', '2017', '2018', '2019', '2020', '2021', '2022']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [54, 98, 189, 298, 412, 552, 732],
        type: 'line',
        smooth: true
      }
    ]
  }

  // 渲染图表
  Chart.setOption(options)
}

//初始化函数
function init() {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById('main'))
  // 绘制图表
  let options = {
    title: {
      text: '各类别的作品数量',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '大类',
        type: 'pie',
        radius: '50%',
        data: dataList.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  // 渲染图表
  Chart.setOption(options)
}
</script>

<template>
  <el-card class="box-card" v-loading="loading">
    <div class="boxList">
      <div class="boxSize" style="background-color: #c68673">
        <div>当前作品总数</div>
        <div style="font-size: 30px; text-align: center; font-weight: bold">
          {{ manageList.length }}
        </div>
      </div>
      <div class="boxSize" style="background-color: #4a82ce">
        <div>参赛学生数</div>
        <div style="font-size: 30px; text-align: center; font-weight: bold">
          {{ studentList.length }}
        </div>
      </div>
      <div class="boxSize" style="background-color: #945594">
        <div>指导老师数</div>
        <div style="font-size: 30px; text-align: center; font-weight: bold">
          {{ teacherList.length }}
        </div>
      </div>
      <div class="boxSize" style="background-color: #4a9abd">
        <div>小类总数</div>
        <div style="font-size: 30px; text-align: center; font-weight: bold">
          {{ categoriesListNum }}
        </div>
      </div>
    </div>
    <div class="echarts-box">
      <div style="flex: 1">
        <div id="main1" style="height: 400px; width: 100%"></div>
      </div>
      <div id="main" style="height: 400px; width: 500px"></div>
    </div>
  </el-card>
</template>

<style scoped>
.echarts-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.boxSize {
  width: 20%;
  height: 100px;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  color: #ffffff;
}

.boxList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
