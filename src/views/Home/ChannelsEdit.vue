<template>
  <div>
    <van-nav-bar title="频道管理">
<!--      <template #right>-->
<!--        <van-icon @click="closeFn" name="cross" size="0.37333334rem" color="white"/>-->
<!--      </template>-->
    </van-nav-bar>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title" :change="isEdit">
        <span>我的频道
          <span class="small-title">
            点击{{ isEdit ? '删除' : '进入' }}频道
          </span>
        </span>
        <span @click="editFn">{{ isEdit ? '完成' : '编辑' }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in userList" :key="obj.id" @click="deleteChannels(obj)">
          <div class="channel-item van-hairline--surround">
            {{ obj.name }}
            <!-- 删除的徽标 -->
            <van-badge v-show="isEdit && obj.id !== 0" color="transparent" class="cross-badge">
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
      <!-- 更多频道 -->
      <div class="more-channel-box">
        <div class="channel-title">
          <span>点击添加更多频道：</span>
        </div>
        <!-- 更多频道列表 -->
        <van-row type="flex">
          <van-col span="6" v-for="obj in otherList" :key="obj.id" @click="moreFn(obj)">
            <div class="channel-item van-hairline--surround">{{ obj.name }}</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChannelsEdit',
  props: {
    userList: Array,
    otherList: Array
  },
  data () {
    return {
      isEdit: false
    }
  },
  methods: {
    editFn () {
      this.isEdit = !this.isEdit
    },
    moreFn (obj) {
      if (this.isEdit === true) {
        this.$emit('addChannels', obj)
      }
    },
    deleteChannels (obj) {
      if (this.isEdit === true) {
        if (obj.id !== 0) {
          this.$emit('deleteChannelsEv', obj)
        }
      } else {
        this.$emit('closeEv')
        this.$emit('input', obj.id)
      }
    }
    // closeFn () {
    //   this.isEdit = false
    //   this.$emit('closeEv')
    // }
  }
}
</script>

<style lang="less" scoped>
.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
