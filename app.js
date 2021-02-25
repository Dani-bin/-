// app.js
import api from './utils/api'
App({
  globalData: {
    // categoryObj: {
    //   userName: '阿嘎收到',
    //   categoryName: '阿嘎收到',
    //   value: '001',
    //   text:'阿斯弗',
    //   id: 17
    // }, 
    // bindUserInfo: {
    //   token: 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImQ5MGFkYTExLWY1NDMtNDg1My04NGZkLTYzMWM5Y2NlOWE2YiJ9.lxbVQDDHELVNsUP9LcwDS436bnOuV9u88vTpbzoCTiCBIIHS945fgZ2Mfe_l1szebsdLp-2unfX0lZy3oRkRFA',
    //   qbUserList: [{
    //     category: "001",
    //     categoryName: "安管人员A",
    //     createBy: "admin",
    //     createTime: null,
    //     id: 17,
    //     openId: null,
    //     params: {},
    //     price: 10000,
    //     remark: null,
    //     searchValue: null,
    //     status: "2",
    //     updateBy: null,
    //     updateTime: null,
    //     userName: "陈伟豪",
    //     userWxId: "10",
    //     zjh: "4681231321",
    //   }],
    //   code: '1'
    // }, 
    // session_key: 'H48AXHmKfnLkKz4VkgDW9Q',
    // openId: 'oSFpC5ZyUpWcl0rUyKdxLoWoIyy4',
    categoryObj: {}, //选择的题库类别
    bindUserInfo: {}, // 绑定的用户信息，包含：qbUserList用户类别（题库类别），token，code
    session_key: '',
    openId: '',
    $api: null, // 全局ajax
    userInfo: null
  },
  onLaunch() {
    this.$api = api
    // 展示本地存储能力  df15d45a852f04fc46e88d3940c9d46e   AppSecret
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 设置屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    // 登录 
    wx.login({
      success: async res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        await this.$api.get('/qb/unauth/userwx/getUserByWxCode', {
          code: res.code
        }).then(ref => {
          if (ref.code === 200) {
            let obj = JSON.parse(ref.data)
            this.globalData.session_key = obj.session_key
            this.globalData.openId = obj.openid
          }
        })
        this.$api.post('/qb/unauth/userwx/getBindUserInfo').then(ref => {
          // console.log(ref)
          if (ref.code === 200) {
            this.globalData.bindUserInfo = ref.data
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(ref.data)
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     console.log(res)
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo
          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
        }
      }
    })
  },
  // 加载中...
  showLoading: (title) => {
    wx.showLoading({
      title: title ? title : '正在加载中...',
      mask: true
    })
  },
  // 操作成功
  success: (title) => {
    wx.showToast({
      title: title ? title : '操作成功',
      icon: 'success',
      duration: 1000
    })
  },
  // 操作失败
  error: (title) => {
    wx.showToast({
      title: title ? title : '操作失败',
      icon: 'none',
      duration: 1000
    })
  },
  // 提示
  info: (title) => {
    wx.showToast({
      title: title ? title : '信息填写不全',
      icon: 'none',
      duration: 1000
    })
  },
})