<template>
  <div>
    <!-- 搜索结果页面-->
    <div class="search-result-container">
      <!--点击实现回退效果-->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.back()"
        fixed>
      </van-nav-bar>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      offset="50">
        <ArticleItem
          v-for="obj in searchResultList"
          :key="obj.art_id"
          :art="obj"
          :isShow="false"
          @click.native="articleDetailFn(obj.art_id)">
        </ArticleItem>
    </van-list>
    <div>
    </div>
  </div>
</template>

<script>
import { searchResultAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem'
export default {
  name: 'SearchResult',
  data () {
    return {
      page: 1, // 页码
      searchResultList: [],
      loading: false,
      finished: false
    }
  },
  async created () {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    // console.log(res)
    this.searchResultList = res.data.data.results
  },
  methods: {
    async onLoad () {
      if (this.searchResultList.length > 0) {
        this.page++
        // console.log(this.page)
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw
        })
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        this.searchResultList = [...this.searchResultList, ...res.data.data.results]
        this.loading = false
      }
    },
    // 跳转文章详情点击事件
    articleDetailFn (id) {
      this.$router.push({
        path: `/article_detail?art_id=${id}`
      })
    }
  },
  components: {
    ArticleItem
  }
}
</script>

<style scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
