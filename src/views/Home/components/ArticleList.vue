<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="50"
        ><!--:immediate-check="false" 第一种方案-->
        <ArticleItem
          v-for="obj in list"
          :key="obj.art_id"
          :art="obj"
          @disLikeEv="dislikeFn"
          @reportEv="reportFn"
          @click.native="articleDetailFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleAPI, dislikeArticle, reportArticleAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem'
import { Notify } from 'vant'

export default {
  name: 'ArticleList',
  props: {
    // list: Array
    channelId: Number
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      theTime: new Date().getTime(),
      isLoading: false // 顶部刷新状态
    }
  },
  components: {
    ArticleItem
  },
  // 第三种方案 直接执行Load方法
  async created () {
    const res = await getArticleAPI({
      channelId: this.channelId,
      timestamp: this.theTime
    })
    this.list = res.data.data.results
    this.theTime = res.data.data.pre_timestamp
  },
  methods: {
    // 封装加载文章函数
    async getArticle () {
      const res = await getArticleAPI({
        channelId: this.channelId,
        timestamp: this.theTime
      })
      this.list = [...this.list, ...res.data.data.results]
      this.theTime = res.data.data.pre_timestamp

      this.loading = false // 如果不关,加载状态将一直在底部显示
      if (res.data.data.pre_timestamp === null) { // 表示是最后一次请求数据
        this.finished = true
      }
      // 顶部加载改为false
      this.isLoading = false
    },
    onLoad () {
      if (this.list.length === 0) {
        this.loading = false
        return
      }
      this.getArticle()
    },
    // 顶部刷新数据方法
    async onRefresh () {
      // 清空数据,再次请求数据
      this.list = []
      this.theTime = new Date().getTime()
      await this.getArticle()
    },
    async dislikeFn (id) {
      await dislikeArticle({
        artId: id
      })
      Notify({ type: 'success', message: '反馈成功' })
    },
    async reportFn (id, value) {
      await reportArticleAPI({
        artId: id,
        type: value
      })
      Notify({ type: 'success', message: '举报成功' })
    },
    // 跳转文章详情点击事件
    articleDetailFn (id) {
      this.$router.push({
        path: `/article_detail?art_id=${id}`
      })
    }
  }
}
</script>

<style scoped>

</style>
