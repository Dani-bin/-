// pages/stzs/stzs.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'btms',
    isOver: false,
    refreshFlag: false,
    value: '',
    total: 0,
    pageNum: 1,
    pageSize: 5,
    searchTestList: []
  },
  onChange(e) {
    this.setData({
      value: e.detail
    })
  },
  // 下拉刷新
  refresh() {
    console.log('刷新了')
    this.setData({
      pageNum: 1
    })
    this.onSearch(true)
  },
  lower() {
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.onSearch()
    console.log('到底了')
  },
  // 背题模式  改变显示状态
  addTmClass(nowTestTm) {
    let key = this.data.active
    if (nowTestTm.queType === "01" || nowTestTm.queType === "03") {
      nowTestTm.qbSubjectItems.forEach(val => {
        val['noSowCode' + key] = true
        if (nowTestTm.answer === val.code) {
          val['className' + key] = 'success'
        } else {
          val['className' + key] = 'error'
        }
      })
    } else {
      let answerList = nowTestTm.answer.split('')
      nowTestTm.qbSubjectItems.forEach(val => {
        val['noSowCode' + key] = true
        if (answerList.includes(val.code)) {
          val['className' + key] = 'success'
        } else {
          val['className' + key] = 'error'
        }
      })
    }
    return nowTestTm
  },
  onSearch(flag) {
    if (flag) {
      this.setData({
        isOver: false,
        total: 0,
        searchTestList: []
      })
    }
    let value = this.data.value
    if (this.data.isOver || value === '') {
      console.log('查询完了或为空')
      return
    }
    Toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
    });
    app.$api.post('/qb/sub/practice/searchSubject', {
      search: value,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(res => {
      Toast.clear();
      this.setData({
        refreshFlag: false
      })
      let searchTestList = this.data.searchTestList
      let arr = res.data.rows.map(nowTestTm => {
        // 重新组装正确答案answer
        let answerList = []
        for (let j = 0; j < nowTestTm.qbSubjectItems.length; j++) {
          if (nowTestTm.qbSubjectItems[j].correct === '1') {
            answerList.push(nowTestTm.qbSubjectItems[j].code)
          }
        }
        nowTestTm.answer = answerList.join()
        let key = this.data.active
        if (nowTestTm.queType === "01" || nowTestTm.queType === "03") {
          nowTestTm.qbSubjectItems.forEach(val => {
            val['noSowCode' + key] = true
            if (nowTestTm.answer === val.code) {
              val['className' + key] = 'success'
            } else {
              val['className' + key] = 'error'
            }
          })
        } else {
          let answerList = nowTestTm.answer.split('')
          nowTestTm.qbSubjectItems.forEach(val => {
            val['noSowCode' + key] = true
            if (answerList.includes(val.code)) {
              val['className' + key] = 'success'
            } else {
              val['className' + key] = 'error'
            }
          })
        }
        return nowTestTm
      })
      searchTestList = searchTestList.concat(arr)
      this.setData({
        isOver: searchTestList.length >= res.data.total,
        total: res.data.total,
        searchTestList
      })
    }).catch(() => {
      Toast.clear();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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