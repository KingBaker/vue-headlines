<template>
  <div>
    <div>
      <van-nav-bar title="黑马头条-登录" />
    </div>
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="user.mobile"
          name="mobile"
          required
          label="手机号"
          placeholder="请输入您的11位手机号"
          :rules="[{ required: true, message: '请填写手机号', pattern: /^1[3-9]\d{9}$/ }]"
        />
        <van-field
          v-model="user.code"
          type="password"
          name="code"
          required
          label="密码"
          placeholder="请输入6位密码"
          :rules="[{ required: true, message: '请填写密码', pattern: /^\d{6}$/ }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info"
                      native-type="submit"
                      :disabled="isLoading"
                      :loading="isLoading"
                      loading-text="正在登录中...">登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { Notify } from 'vant'
import { setToken } from '@/utils/token'
import { setStorage } from '@/utils/storages'

export default {
  name: 'Login_index',
  data () {
    return {
      user: {
        mobile: '15151869311', // 手机号
        code: '246810' // 验证码(密码)(万能密码==246810==(只能写这个)后台死规定
      },
      isLoading: false
    }
  },
  methods: {
    async onSubmit (values) {
      console.log('submit', values)
      console.log(this.user)
      // 登录按钮禁用
      this.isLoading = true
      try {
        const res = await loginAPI(this.user)
        console.log(res)
        Notify({ type: 'success', message: '登录成功!' })
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        // 因为不需要回退到登录页,所以使用replace
        await this.$router.replace({
          // 先查看是否有未遂地址,有就跳转未遂地址,没有去首页
          path: this.$route.query.path || '/layout/home'
        })
      } catch (error) {
        Notify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoading = false // 网络请求完成解除登录按钮禁用
    }
  }
}
</script>

<style>

</style>
