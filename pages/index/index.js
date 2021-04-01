// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    notice: '',
    scrollable: true,
    show: false,
    rylbList: [],
    menuList: [],
    categoryObj: {},
    showFlag1: false,
    showFlag2: false
  },
  seeNotice() {
    wx.navigateTo({
      url: '/pages/tzgg/tzgg',
    })
  },
  onConfirm(event) {
    const {
      value,
      index
    } = event.detail;
    this.setData({
      categoryObj: value,
      show: false
    })
    app.globalData.categoryObj = value
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  goMenu(type) {
    let key = type.currentTarget.dataset.type
    if (key === 'bdzh') {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    if (key === 'yklx') {
      wx.navigateTo({
        url: '/pages/yklx/yklx',
      })
      return
    }
    if (!this.data.categoryObj.value) {
      wx.showToast({
        title: '请先绑定账号',
        icon: 'none',
        duration: 2000
      })
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else {
      if (key === 'wdtk') {
        this.setData({
          show: true
        })
      } else {
        wx.navigateTo({
          url: `/pages/${key}/${key}`,
        })
      }
    }
  },
  onLoad() {
    let userInfo = app.globalData.bindUserInfo
    if (userInfo.qbUserList && userInfo.qbUserList.length > 0) {
      let obj = {
        userName: userInfo.qbUserList[0].userName,
        text: userInfo.qbUserList[0].categoryName,
        // text: userInfo.qbUserList[0].categoryName + '-' + userInfo.qbUserList[0].userName,
        categoryName: userInfo.qbUserList[0].categoryName,
        value: userInfo.qbUserList[0].category,
        zjh: userInfo.qbUserList[0].zjh,
        id: userInfo.qbUserList[0].id
      }
      this.setData({
        categoryObj: obj,
        rylbList: userInfo.qbUserList.map(val => ({
          id: val.id,
          userName: val.userName,
          zjh: val.zjh,
          categoryName: val.categoryName,
          text: val.categoryName,
          // text: val.categoryName + '-' + val.userName,
          value: val.category
        }))
      })
      app.globalData.categoryObj = obj
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        if (!res.qbUserList) return
        let obj = {
          id: res.qbUserList[0].id,
          userName: res.qbUserList[0].userName,
          text: res.qbUserList[0].categoryName,
          // text: res.qbUserList[0].categoryName + '-' + res.qbUserList[0].userName,
          categoryName: res.qbUserList[0].categoryName,
          zjh: res.qbUserList[0].zjh,
          value: res.qbUserList[0].category
        }
        app.globalData.categoryObj = obj
        this.setData({
          categoryObj: obj,
          rylbList: res.qbUserList.map(val => ({
            id: val.id,
            userName: val.userName,
            zjh: val.zjh,
            categoryName: val.categoryName,
            text: val.categoryName,
            // text: val.categoryName + '-' + val.userName,
            value: val.category
          }))
        })
      }
    }
    app.$api.get('/qb/unauth/userwx/getWxMenu').then(res => {
      if (res.code === 200) {
        let num1 = 0
        let num2 = 0
        let menuList = res.data.map(val => {
          if (val.dictValue === 'ztmn' || val.dictValue === 'rclx' || val.dictValue === 'wdct' || val.dictValue === 'wdsc') {
            num1++
          }
          if (val.dictValue === 'cjpm' || val.dictValue === 'ksjl' || val.dictValue === 'yklx') {
            num2++
          }
          return val.dictValue
        })
        this.setData({
          menuList,
          showFlag1: num1 !== 0,
          showFlag2: num2 !== 0
        })
      }
    })
    app.$api.get('/qb/unauth/userwx/getNotice').then(res => {
      let notice = res.data.map(val => {
        return val.notice_title
      }).join(`；   `)
      this.setData({
        scrollable: notice.length > 20,
        notice
      })
    })
  },
  onShow() {},
  onHide() {

  },
  onUnload() {

  },
})