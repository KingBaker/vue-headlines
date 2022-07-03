<template>
  <div>
    <div class="home_container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div>
      <van-tabbar v-model="active" route>
        <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/layout/user">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
      active: 0
    }
  }
  // bug: 加了之后滚动条会出现问题,不知道为什么?
  // watch: {
  //   '$route' (to, from) {
  //     const toDepth = to.path.split('/').length
  //     const fromDepth = from.path.split('/').length
  //     this.transitionName = toDepth >= fromDepth ? 'slide-right' : 'slide-left'
  //   }
  // }
}
</script>

<style lang="less">
.home_container {
  padding-bottom: 50px;
}
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
