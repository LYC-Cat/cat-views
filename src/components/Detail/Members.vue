<template>
  <div>
    <template>
      <el-table :data="tableData" height="250" style="width: 100%">
        <el-table-column prop="userid" label="用户id" width="180" />
        <el-table-column prop="name" label="会员姓名" width="180" />
        <el-table-column prop="account" label="会员账户" />
      </el-table>
    </template>
  </div>
</template>
    <script  setup>
    import {ref} from "vue";

    const tableData =ref([
        {
         userid:1,
          name: 'Tom',
          account:2000,
        },
        {
          userid:2,
          name: '里斯',
          account:203300,
        },
        {
          userid:3,
          name: '加里奥',
          account:2000,
        },
        {
          userid:4,
          name: '艾希',
          account:2000,
        },
      ])
    </script>





<style lang="scss" scoped>
</style>
