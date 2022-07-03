<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list" :class="isShow ? 'art-cmt-container-1' : 'art-cmt-container-2'">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="发表一下你对这篇文章的想法吧 !"
        @load="onLoad"
        :immediate-check="false">
        <!-- 评论的 Item 项 -->
        <div
          class="cmt-item"
          v-for="obj in commentList"
          :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar">
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking === true"
                @click="likeFn(obj)"/>
              <van-icon
                name="like-o"
                size="16" color="gray"
                v-else
                @click="likeFn(obj)"/>
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ formatDate(obj.pubdate)}}</div>
        </div>
      </van-list>
    </div>
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShow">
        <div class="ipt-cmt-div" @click="isShow = false">发表评论</div>
        <div class="icon-box">
          <van-badge max="99" :content="commentCount === 0 ? '' : commentCount">
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="commentAreaFn"/>
          </van-badge>
          <van-icon
            :name="isCollect ? 'star' : 'star-o'"
            size="0.53333334rem"
            @click="collectArticleFn(isCollect)"
            :color="isCollect ? 'red' : ''"/>
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>
      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea v-model.trim="message" v-fofo placeholder="友善评论、理性发言、阳光心灵" @blur="blurFn"></textarea>
        <van-button @click="printFn" type="default" :disabled="message.length === 0">发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import { commentListAPI, commentLikeAPI, unCommentLikeAPI, commentSendAPI } from '@/api'
export default {
  name: 'CommentList',
  props: {
    isCollect: Boolean
  },
  data () {
    return {
      commentList: [],
      offset: null,
      isShow: true,
      commentCount: '0',
      message: '',
      loading: false,
      finished: false,
      lastId: null
    }
  },
  async created () {
    const res = await commentListAPI({
      id: this.$route.query.art_id
    })
    console.log(res)
    this.commentList = res.data.data.results
    this.commentCount = res.data.data.total_count // 评论总数
    this.lastId = res.data.data.last_id // 分页

    if (res.data.data.results.length === 0) {
      this.finished = true
    }
  },
  methods: {
    formatDate: timeAgo,
    async likeFn (obj) {
      if (obj.is_liking === true) {
        // 取消对评论的点赞
        obj.is_liking = false
        await unCommentLikeAPI({
          commentId: obj.com_id
        })
      } else {
        // 对评论的点赞
        obj.is_liking = true
        await commentLikeAPI({
          commentId: obj.com_id
        })
      }
    },
    // 点击进入评论区和回到顶部
    commentAreaFn () {
      // js是在html+css之后运行的,所以属性变量名已经注册完成,可以使用document来直接获取属性名或标签
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
      // const height = document.querySelector('.article-container').scrollHeight
      // window.scrollTo(0, height)
    },
    // 点击发布事件
    async printFn () {
      const res = await commentSendAPI({
        id: this.$route.query.art_id,
        content: this.message
      })
      this.commentList.unshift(res.data.data.new_obj)
      this.message = ''
      this.commentCount++
      this.commentAreaFn()
    },
    // 坑: 采用定时器让失焦函数最后执行,防止先失焦导致其他函数无法正常执行
    blurFn () {
      setTimeout(() => {
        this.isShow = true
      }, 0)
    },
    async onLoad () {
      if (this.commentList.length > 0) {
        const res = await commentListAPI({
          id: this.$route.query.art_id,
          offset: this.lastId
        })
        this.commentList = [...this.commentList, ...res.data.data.results]
        this.lastId = res.data.data.last_id
        this.loading = false
        if (res.data.data.last_id === null) {
          this.finished = true
        }
      } else {
        this.loading = false
      }
    },
    collectArticleFn (boole) {
      if (boole) {
        // 取消收藏
        console.log('取消收藏')
        this.$emit('cancelCollectArticleEv', this.$route.query.art_id)
      } else {
        // 收藏文章
        console.log('收藏文章')
        this.$emit('collectArticleEv', this.$route.query.art_id)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    // 小bug解决方案,徽标的位置偏上
    // 可以
    line-height: 0;
    // 也可以
    //align-items: center;
    ///deep/ .van-badge {
    //  top: 11px
    //}
  }
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
