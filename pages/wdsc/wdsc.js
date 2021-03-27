import utils from '../../utils/util'
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 'dtms',
    nowclientX: '',
    loading: false,
    testStartTime: new Date(),
    testTime: '', // 考试花费时间
    testScores: 0, //考分
    nowTestTm: {}, // 当前考题
    nowTestIndex: 0, //当前考试题目的下标
    testType: 'pending', // pending  end
    show: false,
    successList: [], // 答对的题目
    errorList: [], // 答错的题目
    allTmList: [], // 组装好的题目数据
    subjectRuleObj: {}, // 分数计算规则获取出来的权重 用来计分
  },
  // 背题模式  改变显示状态
  addTmClass() {
    let nowTestTm = this.data.nowTestTm
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
      let answerList = nowTestTm.answer.split(',')
      nowTestTm.qbSubjectItems.forEach(val => {
        val['noSowCode' + key] = true
        if (answerList.includes(val.code)) {
          val['className' + key] = 'success'
        } else {
          val['className' + key] = 'error'
        }
      })
    }
    this.setData({
      nowTestTm
    })
    console.log(nowTestTm)
  },
  changeMode(e) {
    this.setData({
      active: e.detail.name
    })
    this.addTmClass()
  },
  seeSummary() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  // 多选提交答案
  submitTm() {
    let nowTestTm = this.data.nowTestTm
    if (!nowTestTm.answer) {
      wx.showToast({
        title: '无答案',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (nowTestTm.selectAnswer.length === 0) {
      wx.showToast({
        title: '请选择答案',
        icon: 'none',
        duration: 1000
      })
      return
    }
    let answerList = nowTestTm.answer.split(',')
    let successList = this.data.successList
    let errorList = this.data.errorList
    nowTestTm.answerStatus = true // 是否答完
    if (answerList.length === nowTestTm.selectAnswer.length) {
      let flag = true
      answerList.forEach(val => {
        if (!nowTestTm.selectAnswer.includes(val)) {
          flag = false
        }
      })
      nowTestTm.isCorrect = flag // 是否正确
    } else {
      nowTestTm.isCorrect = false // 是否正确
    }
    nowTestTm.qbSubjectItems.forEach(val => {
      // 回答正确
      if (nowTestTm.isCorrect) {
        if (answerList.includes(val.code)) {
          val.className = 'success'
          val.noSowCode = true
        } else {
          val.className = ''
          val.noSowCode = false
        }
      } else {
        val.noSowCode = true
        if (answerList.includes(val.code)) {
          val.className = 'success'
        } else {
          val.className = 'error'
        }
      }
    })
    if (nowTestTm.isCorrect) {
      successList.push(nowTestTm)
    } else {
      errorList.push(nowTestTm)
    }
    let allTmList = this.data.allTmList
    allTmList[this.data.nowTestIndex] = nowTestTm
    this.setData({
      nowTestTm,
      successList,
      errorList,
      allTmList
    })
  },
  // 选择答案
  selectCode(item) {
    let nowTestTm = this.data.nowTestTm
    if (nowTestTm.answerStatus) return
    let code = item.currentTarget.dataset.code
    let idx = item.currentTarget.dataset.idx
    let successList = this.data.successList
    let errorList = this.data.errorList
    // 单选、判断
    if (nowTestTm.queType === "01" || nowTestTm.queType === "03") {
      nowTestTm.selectAnswer = code // 答案
      nowTestTm.answerStatus = true // 是否答完
      nowTestTm.isCorrect = nowTestTm.answer === code // 是否正确
      nowTestTm.qbSubjectItems.forEach(val => {
        // 回答正确
        if (nowTestTm.isCorrect) {
          if (nowTestTm.answer === val.code) {
            val.className = 'success'
            val.noSowCode = true
          } else {
            val.className = ''
            val.noSowCode = false
          }
        } else {
          val.noSowCode = true
          if (nowTestTm.answer === val.code) {
            val.className = 'success'
          } else {
            val.className = 'error'
          }
        }
      })
      if (nowTestTm.isCorrect) {
        successList.push(nowTestTm)
      } else {
        errorList.push(nowTestTm)
      }
    } else {
      if (nowTestTm.selectAnswer.includes(code)) {
        nowTestTm.selectAnswer.splice(nowTestTm.selectAnswer.indexOf(code), 1)
        nowTestTm.qbSubjectItems[idx].dxClssName = ''
      } else {
        nowTestTm.qbSubjectItems[idx].dxClssName = 'multiple-option'
        nowTestTm.selectAnswer.push(code)
      }
    }
    // console.log(nowTestTm)
    // 保存当前题目的答题信息及更新题目数组的题目答题信息
    let allTmList = this.data.allTmList
    allTmList[this.data.nowTestIndex] = nowTestTm
    this.setData({
      nowTestTm,
      successList,
      errorList,
      allTmList
    })
  },
  // 下拉选择切换题目
  selectTm(item) {
    let idx = item.currentTarget.dataset.idx
    let nowTestTm = this.data.allTmList[idx]
    nowTestTm.answerStatus = !!nowTestTm.answerStatus //答题状态
    if (!nowTestTm.selectAnswer) {
      if (nowTestTm.queType === "01" || nowTestTm.queType === "03") {
        nowTestTm.selectAnswer = ''
      } else {
        nowTestTm.selectAnswer = []
        nowTestTm.dxClssName = 'multiple-option'
      }
    }
    this.setData({
      nowTestIndex: idx,
      nowTestTm,
      show: false
    })
    if (this.data.active === 'btms') {
      this.addTmClass()
    }
  },
  // 上一题
  lastTm() {
    let nowTestIndex = this.data.nowTestIndex
    if (nowTestIndex === 0) return
    let nowTestTm = this.data.allTmList[--nowTestIndex]
    nowTestTm.answerStatus = !!nowTestTm.answerStatus //答题状态
    if (!nowTestTm.selectAnswer) {
      if (nowTestTm.queType === "01" || nowTestTm.queType === "03") {
        nowTestTm.selectAnswer = ''
      } else {
        nowTestTm.selectAnswer = []
        nowTestTm.dxClssName = 'multiple-option'
      }
    }
    this.setData({
      nowTestIndex,
      nowTestTm
    })
    if (this.data.active === 'btms') {
      this.addTmClass()
    }
  },
  // 下一题
  nextTm() {
    let nowTestIndex = this.data.nowTestIndex
    if (nowTestIndex === this.data.allTmList.length - 1) return
    let nowTestTm = this.data.allTmList[++nowTestIndex]
    nowTestTm.answerStatus = !!nowTestTm.answerStatus //答题状态
    if (!nowTestTm.selectAnswer) {
      if (nowTestTm.queType === "01" || nowTestTm.queType === "03") {
        nowTestTm.selectAnswer = ''
      } else {
        nowTestTm.selectAnswer = []
        nowTestTm.dxClssName = 'multiple-option'
      }
    }
    this.setData({
      nowTestIndex,
      nowTestTm
    })
    if (this.data.active === 'btms') {
      this.addTmClass()
    }
  },
  //收藏题目 取消收藏
  collectionTm() {
    let nowTestTm = this.data.nowTestTm
    if (nowTestTm.isCollection) {
      app.$api.post('/qb/sub/collect/remove', {
        ids: nowTestTm.collectionId
      }).then(res => {
        nowTestTm.isCollection = false
        let allTmList = this.data.allTmList
        allTmList[this.data.nowTestIndex] = nowTestTm
        app.success('取消成功')
        this.setData({
          nowTestTm,
          allTmList
        })
      }).catch(() => {
        app.error('取消收藏操作失败')
      })
    } else {
      app.$api.post('/qb/sub/collect', {
        subjectId: nowTestTm.id
      }, 'application/json; charset=UTF-8').then(res => {
        nowTestTm.isCollection = true
        nowTestTm.collectionId = res.id
        let allTmList = this.data.allTmList
        allTmList[this.data.nowTestIndex] = nowTestTm
        app.success('收藏成功')
        this.setData({
          nowTestTm,
          allTmList
        })
      })
    }
  },
  // 进入考试
  async goTest() {
    await this.getTestTm()
    let nowTestTm = {
      ...this.data.allTmList[0]
    } || {}
    console.log(nowTestTm)
    nowTestTm.answerStatus = false //答题状态
    //选择的答题选项 多选数组  单选、判断 字符串
    if (nowTestTm.queType === "01" || nowTestTm.queType === "03") {
      nowTestTm.selectAnswer = ''
    } else {
      nowTestTm.selectAnswer = []
    }
    this.setData({
      testType: 'pending',
      testStartTime: new Date(),
      nowTestIndex: 0,
      nowTestTm
    })
  },
  touchstart(e) {
    this.setData({
      nowclientX: e.changedTouches[0].clientX
    })
  },
  touchend(e) {
    let nowclientX = this.data.nowclientX;
    let clientX = e.changedTouches[0].clientX;
    if (clientX > nowclientX && clientX - nowclientX > 50) {
      console.log("向右滑动")
      this.lastTm()
    } else if (nowclientX > clientX && nowclientX - clientX > 50) {
      console.log("向左滑动")
      this.nextTm()
    }
  },
  async getTestTm() {
    Toast.loading({
      duration: 0, 
      message: '加载中...',
      forbidClick: true,
    });
    await app.$api.post('/qb/sub/collect/list').then(res => {
      Toast.clear();
      let allTmList = res.data.map(val => {
        val.qbSubject.collectionId=val.id
        val.qbSubject.isCollection= true
        return val.qbSubject
      })
      for (let i = 0; i < allTmList.length; i++) {
        let answerList = []
        // 重新组装正确答案answer
        for (let j = 0; j < allTmList[i].qbSubjectItems.length; j++) {
          if (allTmList[i].qbSubjectItems[j].correct === '1') {
            answerList.push(allTmList[i].qbSubjectItems[j].code)
          }
        }
        allTmList[i].answer = answerList.join()
      }
      this.setData({
        allTmList
      })
      console.log(allTmList)
    }).catch(() => {
      Toast.clear();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goTest()
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