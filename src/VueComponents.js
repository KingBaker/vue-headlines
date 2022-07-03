import Vue from 'vue'
import {
  NavBar, Form, Field, Button, Tabbar, TabbarItem, Icon, Tab, Tabs, Cell, Divider, CellGroup, DatetimePicker,
  List, PullRefresh, ActionSheet, Popup, Col, Row, Badge, Search, Image as VanImage, Tag, Dialog, Loading, Lazyload
} from 'vant'

Vue.use(Lazyload, {
  preLoad: 0.95 // 预加载高度的比例 文档有错误preload改为preLoad
  // error: 'https://www.elegantthemes.com/blog/wp-content/uploads/2020/02/000-404.png' // 图片失效的备用
})
Vue.use(Lazyload)
Vue.use(Loading)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Search)
Vue.use(VanImage)
Vue.use(Col)
Vue.use(Row)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
