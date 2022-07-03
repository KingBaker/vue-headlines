<template>
  <div class="chat">
    <!-- 固定导航 -->
    <van-nav-bar title="小思同学" left-arrow @click-left="$router.back()" fixed />
    <!--聊天区域-->
    <div class="chat-list">
      <!-- bug: 加一个div防止对整个chat-list进行循环导致过大,css错误-->
      <div v-for="(obj, index) in list" :key="index">
        <div class="chat-item left" v-if="obj.name !== 'me'">
          <van-image fit="cover" round src="https://img01.yzcdn.cn/vant/cat.jpeg"/>
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>
        <div class="chat-item right" v-else>
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image fit="cover" round :src="$store.state.userPhoto"/>
        </div>
      </div>
    </div>
    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="word"  placeholder="说点什么..." @keydown.enter="sendFn" >
        <template #button>
          <span style="font-size:12px;color:#999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token'

export default {
  name: 'ChatIndex',
  data () {
    return {
      word: '',
      list: [
        // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xs', msg: 'hi，你好！我是小思' },
        { name: 'me', msg: 'hi，你好！我是好人' }
      ],
      socket: null
    }
  },
  created () {
    // 创建客户端 websocket 的实例
    // ws或者是http  http://toutiao.itheima.net
    this.socket = io('ws://toutiao.itheima.net', {
      query: {
        token: getToken()
      },
      transports: ['websocket']
    })
    // 建立连接的事件
    // this.socket.on('connect', () => {
    //   console.log('与服务器建立了连接')
    // })
    // 接受后端发过来的消息
    this.socket.on('message', data => {
      this.list.push({
        name: 'xs',
        msg: data.msg
      })
    })
    // this.scrollFn()
  },
  methods: {
    // 发送消息
    sendFn () {
      if (this.word.length !== 0) {
        this.socket.emit('message', {
          msg: this.word,
          timestamp: new Date().getTime()
        })
        // 消息显示到页面上
        this.list.push({
          name: 'me',
          msg: this.word
        })
        this.word = ''
      }
      // this.scrollFn()
    }
    // scrollFn () {
    //   // const chat = document.querySelector('.scroll')
    //   // chat.scrollTop = chat.scrollHeight
    //   // // window.scrollTo(0, chat)
    //   this.$nextTick(() => {
    //     const lastDiv = document.querySelector('.chat-list>div:last-child')
    //     console.log(lastDiv)
    //     lastDiv.scrollIntoView({
    //       behavior: 'smooth'
    //     })
    //   })
    // }
  },
  destroyed () {
    this.socket.close()
    this.socket = null
  },
  // 实时到达聊天的最底部
  watch: {
    list () {
      // Vue 中的 DOM 更新是异步的,所以拿到的div是上一次最后的div,要使用this.$nextTick()来获取本次的最后的div
      // this.$nextTick(() => {
      //   const lastDiv = document.querySelector('.chat-list>div:last-child')
      //   console.log(lastDiv)
      //   lastDiv.scrollIntoView({
      //     behavior: 'smooth'
      //   })
      // })
      // 都可以
      this.$nextTick(() => {
        const chat = document.querySelector('.chat-list')
        chat.scrollTop = chat.scrollHeight
      })
    }
  },
  // 重新进入时到缓存的最低部
  activated () {
    this.$nextTick(() => {
      const chat = document.querySelector('.chat-list')
      chat.scrollTop = chat.scrollHeight
    })
  }
}
</script>

<style scoped lang="less">
.chat {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
