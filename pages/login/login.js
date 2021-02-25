// pages/rclx/rclx.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    rylbList: [],
    category: '',
    categoryMc: '',
    zjh: '',
    xm: ''
  },
  onConfirm(event) {
    const {
      value,
      index
    } = event.detail;
    this.setData({
      categoryMc: value.text,
      category: value.value,
      show: false
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  selectTk() {
    this.setData({
      show: true
    })
  },
  bindCardInput(e) {
    this.setData({
      zjh: e.detail.value
    })
  },
  bindNameInput(e) {
    this.setData({
      xm: e.detail.value
    })
  },
  comfirm() {
    if (!this.data.zjh) {
      wx.showToast({
        title: '请输入证件号码',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.xm) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!this.data.category) {
      wx.showToast({
        title: '请选择题库',
        icon: 'none',
        duration: 1000
      })
      return
    }
    app.$api.post("/qb/unauth/userwx/bindWx", {
      category: this.data.category,
      zjh: this.data.zjh,
      xm: this.data.xm
    }).then(res => {
      app.success(res.msg)
      app.globalData.bindUserInfo = res.data
      wx.switchTab({
        url: '/pages/index/index',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }).catch(res => {
      app.error(res.msg)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.$api.get('/qb/unauth/userwx/getRylb').then(res => {
      this.setData({
        rylbList: res.data.map(val => ({
          text: val.dictLabel,
          value: val.dictValue
        }))
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})