<template>
  <div id="app">
    <!-- 让其创建在切换时不在重新加载 exclude的意思是说除去这些 使用组件的name, 可用字符串,也可以是数组-->
    <keep-alive include="LayoutIndex,UserIndex,HomeIndex,ChatIndex">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// import { getAllChannelsAPI } from '@/api'
export default {

}
</script>
<style>

</style>
