// 分页逻辑

import { ref, computed } from 'vue'
export function usePagination(data, pageSize) {
  // 分页状态
  const pagination = ref({
    currentPage: 1,
    pageSize: pageSize
  })

  // 计算当前页面的条目
  const paginatedData = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
    return data.value.slice(start, start + pagination.value.pageSize)
  })

  // 计算总页数
  const pageCount = computed(() => {
    return Math.ceil(data.value.length / pagination.value.pageSize)
  })

  // 更新当前页码
  const setCurrentPage = (page) => {
    pagination.value.currentPage = page
  }

  return {
    pagination,
    paginatedData,
    pageCount,
    setCurrentPage
  }
}
