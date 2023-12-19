<template>
  <page-container title="作品管理">
    <template #extra>
      <el-button>添加作品</el-button>
    </template>

    <el-table style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">
        <!-- row 就是 channelList 的一项， $index 下标 -->
        <!-- <template #default="{ row, $index }">
          <el-button :icon="Edit" circle plain type="primary"></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template> -->
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <channel-edit ref="dialog"></channel-edit>
  </page-container>
</template>
