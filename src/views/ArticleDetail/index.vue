<template>
  <div class="detailTop">
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()"></van-nav-bar>

    <!-- 加载-->
    <div class="loading" v-if="Object.keys(detail).length === 0">
      <van-loading type="spinner" color="#1989fa">文章加载ing...</van-loading>
    </div>
    <!-- 文章信息区域 -->
    <div class="article-container" v-else>
      <!-- 文章标题 -->
      <h1 class="art-title">{{ detail.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="detail.aut_name" :label="formatDate(detail.pubdate)">
        <template #icon>
          <img :src="detail.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="detail.is_followed"
              @click="followedFn(false)">已关注
            </van-button>
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="followedFn(true)">关注
            </van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="detail.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <!--  attitude  用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞-->
      <div class="like-box">
        <div>
          <van-button
            icon="good-job"
            type="danger"
            size="small"
            @click="attitudeLikeFn"
            v-if="detail.attitude === 1">已点赞
          </van-button>
          <van-button
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            @click="attitudeLikeFn"
            v-else-if="detail.attitude === -1 || detail.attitude === 0">点赞
          </van-button>
        </div>
        <div>
          <van-button
            class="dislike"
            icon="good-job-o"
            type="danger"
            plain
            size="small"
            @click="attitudeDislikeFn"
            v-if="detail.attitude === -1 || detail.attitude === 1"
            >不喜欢
          </van-button>
          <van-button
            class="dislike"
            icon="good-job"
            type="danger"
            size="small"
            @click="attitudeDislikeFn"
            v-else-if="detail.attitude === 0"
          >已不喜欢
          </van-button>
        </div>
      </div>
    </div>
    <!-- 文章评论-->
    <CommentList
      :isCollect="collect"
      @cancelCollectArticleEv="cancelCollectArticleFN"
      @collectArticleEv="collectArticleFn">
    </CommentList>
  </div>
</template>

<script>
import {
  articleDetailAPI, followedUserAPI, unFollowedUserAPI, likeArticleAPI, cancelLikeArticleAPI,
  disLikeArticleAPI, cancelDislikeArticleAPI, collectArticleAPI, cancelCollectArticleAPI
} from '@/api'
import { timeAgo } from '@/utils/date'
import CommentList from './CommentList'

export default {
  name: 'ArticleDetail',
  data () {
    return {
      detail: {},
      collect: false
    }
  },
  async created () {
    const res = await articleDetailAPI({
      artId: this.$route.query.art_id
    })
    console.log(res)
    this.detail = res.data.data
    this.collect = res.data.data.is_collected
  },
  methods: {
    formatDate: timeAgo,
    // 作者关注/取关
    async followedFn (bool) {
      if (bool) { // 用户点了关注按钮
        // 业务: 关注用户
        // 显示: 已关注按钮
        this.detail.is_followed = true
        await followedUserAPI({
          target: this.detail.aut_id
        })
      } else { // 用户点了已关注按钮身上
        // 业务: 取消关注用户
        // 显示: 关注按钮
        this.detail.is_followed = false
        await unFollowedUserAPI({
          uid: this.detail.aut_id
        })
      }
    },
    async attitudeLikeFn () {
      // 喜欢文章点击事件
      if (this.detail.attitude === 1) {
        // 取消对文章的点赞
        this.detail.attitude = -1
        const res = await cancelLikeArticleAPI({
          artId: this.detail.art_id
        })
        console.log(res)
      } else if (this.detail.attitude === -1 || this.detail.attitude === 0) {
        // 对文章的点赞
        this.detail.attitude = 1
        const res = await likeArticleAPI({
          artId: this.detail.art_id
        })
        console.log(res)
      }
    },
    async attitudeDislikeFn () {
      // 不喜欢文章点击事件
      if (this.detail.attitude === 0) {
        // 取消对文章的不喜欢
        this.detail.attitude = -1
        const res = await cancelDislikeArticleAPI({
          artId: this.detail.art_id
        })
        console.log(res)
      } else if (this.detail.attitude === -1 || this.detail.attitude === 1) {
        // 对文章不喜欢
        this.detail.attitude = 0
        const res = await disLikeArticleAPI({
          artId: this.detail.art_id
        })
        console.log(res)
      }
    },
    async cancelCollectArticleFN (artId) {
      // 取消文章收藏事件
      this.collect = false
      await cancelCollectArticleAPI({
        artId: artId
      })
    },
    async collectArticleFn (artId) {
      // 文章收藏事件
      this.collect = true
      await collectArticleAPI({
        artId: artId
      })
    }
  },
  components: {
    CommentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img{
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: space-around;
  .dislike {
    /deep/ .van-icon {
      transform: rotate(180deg);
    }
  }
}
.van-loading {
  text-align: center;
  padding-top: 60px;
}
</style>
