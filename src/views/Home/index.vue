<template>
  <div>
    <!--头部导航-->
    <div>
      <van-nav-bar fixed>
        <template v-slot:left>
          <img class="logo" src="@/assets/toutiao_logo.png" alt="">
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#fff" @click="searchFn" />
        </template>
      </van-nav-bar>
    </div>
    <!--Tab导航-->
    <!--name绑定给v-model-->
    <div class="main">
      <van-tabs v-model="channelId" swipeable animated sticky offset-top="1.226667rem" @click="switchChannelFn">
        <van-tab
          v-for="obj in userChannelsList"
          :title="obj.name"
          :key="obj.id"
          :name="obj.id">
          <ArticleList :channelId="channelId"></ArticleList>
        </van-tab>
      </van-tabs>
      <!--频道管理图标-->
      <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup" />
    </div>
    <!--频道管理弹出层-->
    <van-popup @click-close-icon="editFn" closeable v-model="show" :style="{ width: '100%', height: '100%' }">
      <ChannelsEdit
        @addChannels="addChannels"
        ref="editRef"
        @closeEv="show = false"
        v-model="channelId"
        :userList="userChannelsList"
        :otherList="otherChannelList"
        @deleteChannelsEv="deleteChannelsFn"></ChannelsEdit>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannelsAPI, getUserChannelsAPI, updateChannelsAPI, removeChannelsAPI } from '@/api'
import ArticleList from './components/ArticleList'
import ChannelsEdit from './ChannelsEdit'

export default {
  name: 'HomeIndex',
  data () {
    return {
      channelId: 0,
      userChannelsList: [],
      allChannelsList: [],
      show: false,
      scrollChannels: {}
      // articleList: []
    }
  },
  async created () {
    // user频道列表
    const res = await getUserChannelsAPI()
    this.userChannelsList = res.data.data.channels

    // all频道列表
    const res2 = await getAllChannelsAPI()
    this.allChannelsList = res2.data.data.channels
  },
  methods: {
    showPopup () {
      this.show = true
    },
    async addChannels (obj) {
      this.userChannelsList.push(obj)
      const arr = this.userChannelsList.filter((obj) => { return obj.id !== 0 }) // 先过滤掉id为0的推荐频道, 把剩余的数组返回
      console.log(arr)

      const resultList = arr.map((item, index) => {
        const newObj = { ...item } // 浅拷贝(让对象和原数组脱离关系)
        newObj.seq = index + 1
        delete newObj.name // 删除对象里name键值对
        return newObj
      })
      // map会收集每次遍历return的值形成一个新数组
      console.log(resultList)
      await updateChannelsAPI({
        channels: resultList
      })
    },
    async deleteChannelsFn (channelsObjId) {
      const index = this.userChannelsList.findIndex(obj => obj.id === channelsObjId.id)
      this.userChannelsList.splice(index, 1)
      const res = await removeChannelsAPI({
        channelsId: channelsObjId.id
      })
      console.log(res)
    },
    editFn () {
      this.$refs.editRef.isEdit = false
    },
    searchFn () {
      this.$router.push('/search')
    },
    scrollFn () {
      // 保存滚动条的位置
      this.$route.meta.scrollT = document.documentElement.scrollTop
      this.scrollChannels[this.channelId] = document.documentElement.scrollTop
    },
    // 频道切换事件
    switchChannelFn () {
      if (this.scrollChannels[this.channelId] === undefined) return
      this.$nextTick(() => {
        document.documentElement.scrollTop = this.scrollChannels[this.channelId]
      })
      // setTimeout(() => {
      //   // 两个都ok
      //   window.scrollTo(0, this.scrollChannels[this.channelId])
      //   // document.documentElement.scrollTop = this.scrollChannels[this.channelId]
      // }, 0)
    }
  },
  computed: {
    // 其他频道列表
    otherChannelList () {
      // return this.allChannelsList.filter(bigObj => {
      //   const id = this.userChannelsList.findIndex(smallObj => {
      //     return bigObj.id === smallObj.id
      //   })
      //   return id === -1
      // })
      return this.allChannelsList.filter(bigObj =>
        (this.userChannelsList.findIndex(smallObj =>
          smallObj.id === bigObj.id) === -1))
    }
  },
  activated () {
    // console.log('activated')
    // console.log(this.$route)
    // 激活时实时进行保存滚动条位置
    window.addEventListener('scroll', this.scrollFn)
    // 再次激活时,立刻滚回保存的位置
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },
  deactivated () {
    // 失活时移出滚动条监听事件
    window.removeEventListener('scroll', this.scrollFn)
  },
  components: {
    ArticleList,
    ChannelsEdit
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}
.main {
  padding-top: 46px;
}
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}
.moreChannels {
  position: fixed;
  top: 59px;
  right: 8px;
  z-index: 999;
}
/deep/ .van-popup__close-icon--top-right {
  top: 12px
 }
</style>
