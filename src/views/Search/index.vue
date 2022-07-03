<template>
  <div>
    <div class="search-header">
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback"
                @click="$router.back()" />
      <van-search
        placeholder="请输入搜索关键词"
        shape="round"
        v-fofo
        @input="inputFn"
        v-model.trim="kw"
        @search="searchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(str, index) in suggestList"
        :key="index"
        v-html="lightFn(str, kw)"
        @click="suggestClickFn(str)">
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon @click="deleteHistory" name="delete" class="search-icon" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          @click="historyClickFn(str)"
          class="history-item"
          v-for="(str, index) in history"
          :key="index">
          {{ str }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestAPI } from '@/api'
import { setStorage, getStorage } from '@/utils/storages'

export default {
  name: 'Search_index',
  data () {
    return {
      kw: '', // 输入关键字
      timer: null, // 防抖定时器
      suggestList: [],
      history: JSON.parse(getStorage('history')) || []
    }
  },
  methods: {
    inputFn () {
      // 设置防抖, 防止用户短时多次提交
      // 事件多次触发,清楚上一个定时器,重新计时
      clearTimeout(this.timer)
      // 清空联想列表
      if (this.kw.length === 0) {
        this.suggestList = []
      } else {
        this.timer = setTimeout(async () => {
          if (this.kw.length === 0) return
          const res = await suggestAPI({
            keywords: this.kw
          })
          console.log(res)
          this.suggestList = res.data.data.options
          console.log(this.suggestList)
        }, 1000)
      }
    },
    // 处理高亮文字
    lightFn (originStr, target) {
      // const reg = new RegExp(target, 'ig')
      // return originStr.replaceAll(reg, (match) => {
      //   return `<span style="color: red">${match}</span>`
      // })
      // originStr是原来的字符串
      // target是关键字
      if (this.suggestList[0] === null || this.suggestList.length === 0) {
        this.suggestList = ['抱歉 ! 没有找到您想要的 !']
        return this.suggestList
      } else {
        const reg = new RegExp(target, 'gi')
        // console.log(originStr.match(reg))
        return originStr.replaceAll(reg, (match) => {
          return `<span style="color: red">${match}</span>`
        })
      }
    },
    // 清空history列表
    deleteHistory () {
      this.history = []
    },
    // 路由跳转函数
    // 坑: 路由跳转在watch之前执行, 所以应该包裹一个定时器,让路由跳转在最后执行
    moveFn (theStr) {
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${theStr}`
        })
      }, 0)
    },
    // 添加历史记录去重第一种
    addHistoryFn (str) {
      if (this.history.indexOf(str.toLowerCase()) === -1) {
        this.history.push(str.toLowerCase())
      }
    },
    // history点击事件
    historyClickFn (str) {
      this.moveFn(str)
    },
    // 输入搜索事件
    searchFn () {
      if (this.kw.length > 0) {
        this.addHistoryFn(this.kw)
        this.moveFn(this.kw)
      }
    },
    // 搜索建议点击事件
    suggestClickFn (str) {
      this.addHistoryFn(str)
      this.moveFn(str)
    }
  },
  // 监听历史记录
  watch: {
    history: {
      deep: true,
      handler () {
        // 添加历史记录去重第二种
        // 可以
        // const hisList = [...new Set(this.history)]
        // localStorage.setItem('history', JSON.stringify(hisList))
        // 或者
        // const hisList = new Set(this.history)
        // const arr = Array.from(hisList)
        // localStorage.setItem('history', JSON.stringify(arr))
        // 保存历史数据到本地
        setStorage('history', JSON.stringify(this.history))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
    background: #007bff;
  }
}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0 8px;
    border-radius: 10px;
  }
}
</style>
