// pages/ztmn/ztmn.js
import utils from '../../utils/util'
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowclientX: '',
    testTile: "",
    loading: false,
    testStartTime: new Date(),
    testTime: '', // 考试花费时间
    testScores: 0, //考分
    nowTestTm: {}, // 当前考题
    nowTestIndex: 0, //当前考试题目的下标
    testType: 'start', //start pending  end
    show: false,
    time: 100 * 60 * 1000,
    successList: [], // 答对的题目
    errorList: [], // 答错的题目
    allTmList: [], // 组装好的题目数据
    subjectRule: [], // 分数计算规则
    subjectRuleObj: {}, // 分数计算规则获取出来的权重 用来计分
    subjects: {}, //题目数据
  },
  finished() {
    wx.showToast({
      title: '时间到，考试结束',
      icon: 'none',
      duration: 1000
    })
    this.endTest()
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
    let answerList = nowTestTm.answer.split('')
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
  // 考试结束
  endTest(flag) {
    let that = this
    if (flag) {
      wx.showModal({
        title: '提示',
        content: '确定此时交卷？',
        success(res) {
          if (res.confirm) {
            that.endTestFn()
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else {
      this.endTestFn()
    }
  },
  endTestFn() {
    let subjectRuleObj = this.data.subjectRuleObj
    let allTmList = this.data.allTmList
    let TestEndMsg = {}
    let num = 0
    allTmList.forEach(val => {
      if (val.isCorrect) {
        num += val.score
        // num += val.score * subjectRuleObj[val.subClass]
      }
    })
    let testEndtTime = new Date().getTime()
    let testStartTime = this.data.testStartTime.getTime()
    TestEndMsg.testTime = this.getTestTime(Math.round((testEndtTime - testStartTime) / 1000))
    TestEndMsg.testScores = num.toFixed(1)
    let obj = {
      "correctSubIdList": this.data.successList.map(val => val.id),
      "qbExamRecor": {
        "endTime": utils.formatTime(new Date()),
        "examTime": utils.formatTime(testStartTime),
        "id": '',
        "openId": app.globalData.openId,
        "remark": "",
        "score": TestEndMsg.testScores,
        "searchValue": "",
        "subType": app.globalData.categoryObj.value,
        "userId": app.globalData.categoryObj.id
      },
      "wrongSubIdList": this.data.errorList.map(val => val.id)
    }
    app.$api.post('/qb/sub/practice/saveRealPractice', obj, 'application/json; charset=UTF-8')
    this.setData({
      testType: 'end',
      TestEndMsg
    })
  },
  getTestTime(val) {
    if (val < 60) {
      return val + "秒";
    } else {
      var min_total = Math.floor(val / 60); // 分钟
      var sec = Math.floor(val % 60); // 余秒
      if (min_total < 60) {
        return min_total + "分钟" + sec + "秒";
      } else {
        var hour_total = Math.floor(min_total / 60); // 小时数
        var min = Math.floor(min_total % 60); // 余分钟
        return hour_total + "小时" + min + "分钟" + sec + "秒";
      }
    }
  },
  goDtph() {
    wx.redirectTo({
      url: '/pages/cjpm/cjpm'
    })
  },
  //重新考试
  againTest() {
    this.goTest()
    this.setData({
      testStartTime: new Date(),
      nowTestIndex: 0,
      testType: 'pending',
      successList: [], // 答对的题目
      errorList: [], // 答错的题目
    })
  },
  seeErrorTm() {
    wx.redirectTo({
      url: '/pages/wdct/wdct'
    })
  },
  async getTestTm() {
    function randomsort(a, b) {
      return Math.random() > .5 ? -1 : 1;
      //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
    }
    Toast.loading({
      duration: 0,
      message: '加载中...',
      forbidClick: true,
    })
    this.setData({
      loading: true
    })
    await app.$api.post('/qb/sub/practice/realList', {
      subType: app.globalData.categoryObj.value
    }).then(res => {
      Toast.clear();
      let subjectRule = res.data.subjectRule
      let subjects = res.data.subjects
      let allTmList = []
      let subjectRuleObj = {}
      subjectRule.forEach(val => {
        subjectRuleObj[val.subClass] = val.weight
        subjects[val.subClass].forEach(item => {
          allTmList = allTmList.concat(item.subjects)
        })
      })
      this.setData({
        subjectRule,
        subjectRuleObj,
        subjects,
        allTmList: allTmList.sort(randomsort)
      })
    }).catch(error => {
      Toast.clear();
      wx.showToast({
        title: '获取失败',
        icon: 'none',
        duration: 1000
      })
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      testTile: app.globalData.categoryObj.categoryName
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