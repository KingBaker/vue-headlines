import axios from './request.js'
import { getStorage } from '@/utils/storages'
// 进行模块的中转
// export * from '/'

// 频道接口
export const getAllChannelsAPI = () => {
  return axios({
    url: '/v1_0/channels'
  })
}

// 登录接口
export const loginAPI = ({ mobile, code }) => {
  return axios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}

// 获取用户频道
export const getUserChannelsAPI = () => {
  return axios({
    url: '/v1_0/user/channels'
  })
}

// 频道 - 更新已选
export const updateChannelsAPI = ({ channels }) => {
  return axios({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels: channels
    }
  })
}

// 删除用户指定频道
export const removeChannelsAPI = (channelId) => {
  return axios({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
  })
}

// 获取文章新闻推荐
export const getArticleAPI = ({ channelId, timestamp }) => {
  return axios({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}

// 不感兴趣
export const dislikeArticle = ({ artId }) => {
  return axios({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: artId
    }
  })
}

// 举报文章
export const reportArticleAPI = ({ artId, type }) => {
  return axios({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
      target: artId,
      type: type,
      remark: '看你自己写什么'
    }
  })
}

// 获取搜索联想建议
export const suggestAPI = ({ keywords }) => {
  return axios({
    url: '/v1_0/suggestion',
    params: {
      q: keywords
    }
  })
}

// 获取搜索结果
export const searchResultAPI = ({ page = 1, perPage = 10, q }) => {
  return axios({
    url: '/v1_0/search',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}

// 获取文章详情
export const articleDetailAPI = ({ artId }) => {
  return axios({
    url: `/v1_0/articles/${artId}`
  })
}

// 文章 - 关注作者
export const followedUserAPI = ({ target }) => {
  return axios({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: target
    }
  })
}
// 文章 - 取消关注作者
export const unFollowedUserAPI = ({ uid }) => {
  return axios({
    // 这uid只是个变量名, 把值拼接在url发给后台(无需指定参数名)
    url: `/v1_0/user/followings/${uid}`,
    method: 'DELETE'
  })
}

// 对文章点赞
export const likeArticleAPI = ({ artId }) => {
  return axios({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target: artId
    }
  })
}

// 取消对文章点赞
export const cancelLikeArticleAPI = ({ artId }) => {
  return axios({
    url: `/v1_0/article/likings/${artId}`,
    method: 'DELETE'
  })
}

// 对文章不喜欢
export const disLikeArticleAPI = ({ artId }) => {
  return axios({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: artId
    }
  })
}

// 取消对文章不喜欢
export const cancelDislikeArticleAPI = ({ artId }) => {
  return axios({
    url: `/v1_0/article/dislikes/${artId}`,
    method: 'DELETE'
  })
}

// 获取文章评论
export const commentListAPI = ({ id, offset = null, limit = 10 }) => {
  return axios({
    url: '/v1_0/comments',
    params: {
      type: 'a', // 当需要对评论进行评论是需要传递参数
      source: id,
      offset,
      limit
    }
  })
}

// 对评论点赞
export const commentLikeAPI = ({ commentId }) => {
  return axios({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: commentId
    }
  })
}

// 对评论取消点赞
export const unCommentLikeAPI = ({ commentId }) => {
  return axios({
    url: `/v1_0/comment/likings/${commentId}`,
    method: 'DELETE'
  })
}

// 对文章进行评论
export const commentSendAPI = ({ id, content, artId }) => {
  // data请求体传参不会忽略null值,只有params会忽略null值,
  // art_id只有需要对评论进行评论时才需要,所以给art_id一个默认的null值
  const obj = {
    target: id, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
    content // 评论内容
  }
  if (artId !== null) {
    obj.art_id = artId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
  }
  return axios({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}
// 收藏文章
export const collectArticleAPI = ({ artId }) => {
  return axios({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target: artId
    }
  })
}

// 取消收藏文章
export const cancelCollectArticleAPI = ({ artId }) => {
  return axios({
    url: `/v1_0/article/collections/${artId}`,
    method: 'DELETE'
  })
}

// 获取用户自己信息
export const userInfoAPI = () => {
  return axios({
    url: '/v1_0/user'
  })
}

// 获取用户个人资料
export const userProfileAPI = () => {
  return axios({
    url: '/v1_0/user/profile'
  })
}

// 编辑用户照片资料
export const userPhotoAPI = (fd) => {
  return axios({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    // 如果请求体是一个ForData表单对象,也不用自己传Content-Type,
    // axios也不会转换成json字符串,浏览器会自己进行处理是JSON字符串还是ForData表单对象
    data: fd // ForData表单对象直接传表单对象,不用在data进行处理
  })
}

// 编辑用户个人资料
export const editInfoAPI = (dataObj) => {
  const obj = {
    name: '', // 昵称
    gender: null,
    birthday: '', // 生日，格式'2018-12-20'
    real_name: '', // 真实姓名
    intro: null
  }
  for (const prop in obj) {
    if (dataObj[prop] === undefined) {
      delete dataObj[prop]
    } else {
      obj[prop] = dataObj[prop]
    }
  }

  return axios({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}

// 刷新用户token
export const tokenAPI = () => {
  return axios({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + getStorage('refresh_token')
    }
  })
}

// new Date().toISOString().split('T')[0] // 生日，格式'2018-12-20'
