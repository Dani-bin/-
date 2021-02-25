// pages/cjpm/cjpm.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cjpmList: []
  },
  getClassRank() {
    Toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
    });
    app.$api.post('/qb/sub/record/getRankBySubType').then(res => {
      Toast.clear();
      let cjpmList = res.data.map(val => {
        val.userName = val.user_name ? (val.user_name.slice(0, 1) + '**') : ''
        val.end_time = val.end_time ? val.end_time.slice(0, 10) : ''
        return val
      })
      this.setData({
        cjpmList
      })
    }).catch(() => {
      Toast.clear();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClassRank()
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