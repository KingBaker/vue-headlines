<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box" style="padding-bottom: .3rem">
          <!-- 标题 -->
          <span style="padding-right: .3rem">{{ art.title }}</span>
          <!--单图-->
          <van-image
            lazy-load
            class="thumb"
            v-if="art.cover.type === 1"
            :src="art.cover.images[0]"
            alt=""
            error-icon="https://www.elegantthemes.com/blog/wp-content/uploads/2020/02/000-404.png">
          </van-image>
          <!--<img class="thumb" v-if="art.cover.type === 1" :src="art.cover.images[0]" alt="">-->
        </div>
        <!--多图-->
        <div v-if="art.cover.type > 1" class="thumb-box">
          <van-image
            v-for="(imgUrl, index) in art.cover.images"
            :key="index"
            :src=imgUrl
            alt=""
            class="thumb"
            lazy-load
            error-icon="https://www.elegantthemes.com/blog/wp-content/uploads/2020/02/000-404.png">
          </van-image>
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ art.aut_name }}</span>
            <span>{{ art.comm_count }}评论</span>
            <span>发布日期 {{ formatTime(art.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <!--反馈面板-->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      :cancel-text="bottomText"
      @cancel="backCancel"
      @close="closeFn"
      get-container="body"
    />
  </div>
</template>

<script>
// 复用的组件尽量不要进行网络请求
import { timeAgo } from '@/utils/date'
import { firstActions, secondActions } from '@/api/report'

export default {
  props: {
    art: Object,
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: false,
      bottomText: '取消',
      actions: firstActions
    }
  },
  methods: {
    formatTime: timeAgo,
    onSelect (action) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.bottomText = '返回'
      } else if (action.name === '不感兴趣') {
        this.$emit('disLikeEv', this.art.art_id)
        this.show = false
      } else {
        this.$emit('reportEv', this.art.art_id, action.value)
        this.show = false
      }
    },
    backCancel () {
      if (this.bottomText === '返回') {
        this.actions = firstActions
        this.bottomText = '取消'
        this.show = true
      }
    },
    closeFn () {
      this.actions = firstActions
      this.bottomText = '取消'
    }
  }
}
</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  span {
    flex: 2;
  }
  .van-image {
    flex: 1;
  }
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span{
  margin: 0 3px;
  &:first-child{
    margin-left: 0;
  }
}

/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
  /deep/ .van-icon__image {
    width: 113px;
    height: 70px;
    object-fit: cover;
  }
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
