export const directive = {
  install (Vue) {
    Vue.directive('fofo', {
      // 在第一次插入真实的DOM时使用
      inserted (el) {
        // 对el 进行判断
        // DOM.nodeName 可以拿到标签的名字(大写的字符串)
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框,进行dom搜索
          const input = el.querySelector('input')
          const textarea = el.querySelector('textarea')
          // 不一定可以获取的到,需要进行判断
          if (input) input.focus()
          if (textarea) textarea.focus()
        }
      },
      // 在发生了更新的时候调用
      update (el) {
        // 对el 进行判断
        // DOM.nodeName 可以拿到标签的名字(大写的字符串)
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          // el本身不是输入框,进行dom搜索
          const input = el.querySelector('input')
          const textarea = el.querySelector('textarea')
          // 不一定可以获取的到,需要进行判断
          if (input) input.focus()
          if (textarea) textarea.focus()
        }
      }
    })
  }
}
// 封装中间件函数的插件
// use执行目标对象中的install方法并传入Vue类
