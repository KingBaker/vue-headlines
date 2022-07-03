<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userPhoto" alt="" class="avatar">
        </template>
        <template #title>
          <span class="username">{{ $store.state.userName }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userinfo.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userinfo.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userinfo.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/info_edit" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn" />
    </van-cell-group>
  </div>
</template>

<script>
import { userInfoAPI } from '@/api'
import { removeToken } from '@/utils/token'
import { Dialog, Notify } from 'vant'
import { mapMutations } from 'vuex'

export default {
  name: 'UserIndex',
  data () {
    return {
      userinfo: {}
    }
  },
  async created () {
    const res = await userInfoAPI()
    this.userinfo = res.data.data
    // 直接使用store
    // this.$store.commit('SET_USERPHOTO', this.userinfo.photo)
    this.SET_USERPHOTO(this.userinfo.photo)
    this.SET_USERNAME((this.userinfo.name))
  },
  methods: {
    // 映射使用store
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),
    quitFn () {
      Dialog.confirm({
        title: '退出提示',
        message: '你真的要走了吗? 你不爱我了吗? 我还是爱你的!',
        theme: 'round-button'
      })
        .then(() => {
          Notify({ type: 'danger', message: '😭你果真不爱我了😥' })
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => {
          Notify({ type: 'success', message: '😘我就知道你还爱我🥰' })
        })
    }
  }
}
</script>

<style scoped lang="less">
.user-card {
  background: #007bff;
  color: white;
  padding-top: 20px;
  .van-cell {
    background: #007bff;
    color: white;
    .avatar {
      width: 60px;
      height: 60px;
      background: #fff;
      border-radius: 50%;
      margin-right: 10px;
    }
    .username {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
.user-data {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 14px;
  padding: 30px 0;
  .user-data-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 33.3%;
  }
}
</style>
