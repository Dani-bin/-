const host = 'https://wx.yuchenchuanmei.com/api'
// const host = 'http://294582yo61.eicp.vip'
const request = (url, options) => {
  return new Promise((resolve, reject) => {
    const app = getApp()
    const bindUserInfo = app.globalData.bindUserInfo
    const openId = app.globalData.openId || ''
    const userId = app.globalData.categoryObj.id || ''
    const subType = app.globalData.categoryObj.value || '' //人员类别/题型
    wx.request({
      url: `${host}${url}`,
      method: options.method,
      data: {
        userId,
        openId,
        subType,
        ...options.data,
      },
      header: {
        'content-type': options.contentType ? options.contentType : (options.method === 'GET' ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded'),
        // 'Content-Type': 'application/json; charset=UTF-8',
        'token': bindUserInfo.token ? bindUserInfo.token : '' // 看自己是否需要
      },
      success(request) {
        if (request.data.code === 200) {
          resolve(request.data)
        } else {
          reject(request.data)
          if (request.data.code === -1) {
            wx.showToast({
              title: request.data.msg,
              icon: 'none',
              duration: 1000
            })
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      },
      fail(error) {
        reject(error.data)
      }
    })
  })
}

const get = (url, options = {}) => {
  return request(url, {
    method: 'GET',
    data: options
  })
}

const post = (url, options, contentType) => {
  return request(url, {
    method: 'POST',
    data: options,
    contentType
  })
}

const put = (url, options) => {
  return request(url, {
    method: 'PUT',
    data: options
  })
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, {
    method: 'DELETE',
    data: options
  })
}

module.exports = {
  get,
  post,
  put,
  remove
}