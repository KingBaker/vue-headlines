<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="$store.state.userPhoto" @click="userPhotoFn" />
          <!-- 移花接木到input file类型的方式进行图片点击上传-->
          <input
            type="file"
            ref="inputFile"
            v-show="false"
            accept="image/*"
            @change="photoChange">
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userProfile.name" @click.prevent="userNameFn"></van-cell>
      <van-dialog v-model="show" title="请输入7位中英文组合的名称" show-cancel-button :before-close="confirmNameFn">
        <input type="text" v-model.trim="changeName" ref="focusInput" maxlength="20">
      </van-dialog>
      <van-cell title="生日" is-link :value="userProfile.birthday" @click="changeBirthday" />
      <van-popup v-model="birthdayShow" position="bottom" :style="{ height: '50%' }">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="confirmBirthday"
          @cancel="cancelFn"
        />
      </van-popup>
      <van-cell
        title="性别"
        is-link
        :value="userProfile.gender === null ? '牛子妹妹?' : (userProfile.gender === 0 ? '男' : '女' )"
        @click="switchGenderFn"/>
      <!-- 性别选项-->
      <van-action-sheet
        v-model="genderShow"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        @select="selectGender"/>
      <van-field
        v-model.trim="introValue"
        label="个人介绍"
        :placeholder="userProfile.intro === null ? '这个懒逼啥也没有!' : userProfile.intro"
        input-align="right"
        maxlength="30"
        @focus="changeIntroFn"
      />
    </van-cell-group>
    <div style="padding: 1rem;">
      <van-button
        v-show="introBtn"
        round block type="info"
        native-type="submit"
        loading-text="正在登录中..."
        @click="introConfirm">完成
      </van-button>
    </div>
  </div>
</template>

<script>
import { userProfileAPI, userPhotoAPI, editInfoAPI } from '@/api'
import { Notify } from 'vant'
import { mapMutations } from 'vuex'
export default {
  name: 'InfoEdit',
  data () {
    return {
      userProfile: {},
      show: false, // 改变名称输入框是否展示
      changeName: '',
      birthdayShow: false, // 改变生日选择是否展示
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      genderShow: false, // 改变性别选项是否展示
      actions: [{ name: '男' }, { name: '女' }, { name: '未知' }],
      introValue: '',
      introBtn: false // 个人介绍提交按钮是否出现
    }
  },
  async created () {
    const res = await userProfileAPI()
    this.userProfile = res.data.data
  },
  methods: {
    ...mapMutations(['SET_USERPHOTO', 'SET_USERNAME']),
    // js模拟input的点击,通过ref进行对input的点击
    userPhotoFn () {
      this.$refs.inputFile.click()
    },
    // 文件改变事件
    async photoChange (e) {
      // 本机没有的bug,防止点击取消发送空的图片
      if (e.target.files.length === 0) return
      const theFd = new FormData()
      theFd.append('photo', e.target.files[0])

      const res = await userPhotoAPI(theFd)
      this.userProfile.photo = res.data.data.photo
      this.SET_USERPHOTO(res.data.data.photo)
    },
    // 名称修改点击事件
    userNameFn () {
      this.show = true
      // input中使用ref="focusInput" 或者使用自定义指令v-fofo,但是有失焦的小bug,不知道这么解决
      setTimeout(() => {
        this.$refs.focusInput.focus()
      }, 500)
    },
    // 修改名称方法
    async confirmNameFn (action, done) {
      if (action === 'confirm') {
        const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.changeName) === true) {
          await editInfoAPI({
            name: this.changeName
          })
          this.userProfile.name = this.changeName
          this.SET_USERNAME(this.userProfile.name)
          this.changeName = ''
          done()
        } else {
          Notify({ type: 'warning', message: '请输入7位中英文组合的名称' })
          done(false)
        }
      } else {
        done()
      }
    },
    // 调用改变时间的组件
    changeBirthday () {
      this.birthdayShow = true
      this.currentDate = new Date(this.userProfile.birthday)
    },
    // 改变生日确认函数
    async confirmBirthday (value) {
      // toISOString(时区总是 UTC（协调世界时）) 有时区的偏移量的小问题,中国时区需要加8个小时
      // 例子, 解决所有时区的偏移量问题
      // const date = new Date() // Or the date you'd like converted.
      // const isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()

      // const date = value.getTime() + 8 * 3600 * 1000
      // console.log(date.toISOString().split('T')[0])
      // +value +号的作用等同于value.getTime() 转化为时间戳
      const myBirthday = new Date(+value + 8 * 3600 * 1000).toISOString().split('T')[0]
      this.userProfile.birthday = myBirthday
      this.birthdayShow = false
      await editInfoAPI({
        birthday: myBirthday
      })
    },
    // 取消生日选择函数
    cancelFn () {
      this.birthdayShow = false
    },
    // 召唤性别选项组件
    switchGenderFn () {
      this.genderShow = true
    },
    // 进行性别的选择
    // 性别，0-男，1-女
    async selectGender (action) {
      if (action.name === '男') {
        this.userProfile.gender = 0
        await editInfoAPI({
          gender: 0
        })
      } else if (action.name === '女') {
        this.userProfile.gender = 1
        await editInfoAPI({
          gender: 1
        })
      } else {
        this.userProfile.gender = null
        await editInfoAPI({
          gender: null
        })
      }
    },
    // 个人介绍聚焦事件
    changeIntroFn () {
      this.introBtn = true
    },
    // 个人介绍失焦事件
    // cancelChangeIntroFn () {
    //   this.introBtn = false
    //   this.userProfile.intro = this.introValue
    // },
    // 个人介绍按钮提交事件
    async introConfirm () {
      this.userProfile.intro = this.introValue
      await editInfoAPI({
        intro: this.introValue
      })
      this.introValue = ''
      this.introBtn = false
    }
  }
}
</script>

<style scoped lang="less">
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}

/deep/ .van-dialog__content {
  text-align: center;
  input {
    text-align: center;
    border: none;
    outline: none;
    padding: 20px 0 10px;
  }
}
</style>
