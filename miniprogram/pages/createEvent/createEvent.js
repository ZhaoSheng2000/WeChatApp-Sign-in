import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
const util = require('../../utils/utils.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTitle: '',
    activeRules: '',
    activePeople: '不限', //活动人数类型
    people: '', //限制的人数
    score:'0',
    show: false, //活动人数show
    startTimeShow:false,
    endTimeShow:false,
    startTime:'',
    endTime:'无',
    ifAdd: true, //手动添加
    ifLocation: false, //定位
    location: '', //具体位置
    locationRange: '', //签到范围
    latitude: '', //经度
    longitude: '', //纬度
    columns: ['不限', '自定义'],
    toolbar:false ,//时间选择器顶部显示
    minDate: new Date(2020, 1, 1).getTime(),
    maxDate: new Date(2029, 10, 1).getTime(),
    startDate: new Date().getTime(),
    endDate: ''
  },


  onTitle(event) {
    // event.detail 为当前输入的值
    this.setData({
      activeTitle: event.detail
    })
  },

  onRules(event) {
    this.setData({
      activeRules: event.detail
    })
  },

  setMan() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false,
      startTimeShow:false,
      endTimeShow:false
    });
  },

  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    if (value === "不限") {
      this.setData({
        people: ''
      })
    }
    this.setData({
      activePeople: value
    })
  },
  onPeopleChange(event) {
    this.setData({
      people: event.detail
    })
  },

  onScoreChange(e){
    this.setData({
      score:e.detail
    })
  },

  showSetStartTime(){
    this.setData({
      startTimeShow:true
    })
  },

  onStartTimeInput(event) {
    const startTime = util.formatTimeTwo(event.detail / 1000, 'Y/M/D h:m') 
    this.setData({
      startTime,
      startDate:event.detail,
    });
  },

  onEndTimeInput(event){
    const endTime = util.formatTimeTwo(event.detail / 1000, 'Y/M/D h:m')
    this.setData({
      endTime,
      endDate:event.detail
    });
  },

  setEndTime(){
    this.setData({
      endTimeShow: true
    })
  },

  ifAdd({
    detail
  }) {
    this.setData({
      ifAdd: detail
    });
  },

  ifLocation({
    detail
  }) {
    this.setData({
      ifLocation: detail
    });
  },
  setLocation() {
    wx.chooseLocation({
      success: res => {
        console.log(res)
        this.setData({
          location: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },

  rangeTips() {
    Dialog.alert({
      message: '位置信息因网络环境存在误差，签到范围建议≥50m'
    }).then(() => {
      // on close
    });
  },

  onLocationRange(event) {
    this.setData({
      locationRange: event.detail
    })
  },

  onConfirm() {
    const {
      activeTitle,
      activeRules,
      activePeople,
      people,
      ifAdd,
      ifLocation,
      location,
      locationRange,
      latitude,
      longitude,
      startTime,
      endTime,
      startDate,
      endDate,
      score
    } = this.data
    if (!activeTitle) {
      Toast('活动标题不能为空！');
    } else if (activePeople === '自定义' && !people) {
      Toast('请输入活动参与人数！')
    } else if (!score){
      Toast('请输入活动分值！')
    } else if (ifLocation && !location) {
      Toast('请设置签到地点！')
    } else if (ifLocation && !locationRange) {
      Toast('请设置签到范围！')
    } else if (!endDate||startDate===endDate){
      Toast('请正确设置签到结束时间！')
    }else {
      const db = wx.cloud.database()
      const activity = db.collection('activity')
      const activityUser = db.collection('activityUser')
      const uuid = util.uuid(32)
      activity.add({
        data: {
          _id:uuid,
          activeTitle,
          activeRules,
          activePeople,
          people,
          ifAdd,
          ifLocation,
          location,
          locationRange,
          latitude,
          longitude,
          startTime,
          endTime,
          startDate,
          endDate,
          score
        },
        success: function(res) {
          Toast.loading({
            mask: true,
            message: '创建中...'
          });
          activityUser.add({
            data: {
              activityId: res._id,
              attendUsers: [app.globalData.openid]
            },
            success: res => {
              Toast.success('创建成功！');
              wx.switchTab({
                url: '../record/record',
              })
            }
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '创建活动'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})