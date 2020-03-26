// pages/changeInfo/changeInfo.js
import Toast from '@vant/weapp/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    myclass:'',
    number:'',
    username:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '修改信息'
    })
    //数据库查询
    const openid = app.globalData.openid
    const db = wx.cloud.database()
    const todos = db.collection('userinfo')
    db.collection('userinfo').where({
      _openid: openid,
    })
      .get({
        success: res => {
          this.setData({ user:res.data[0] })
        }
      })

  },

  classChange(event) {
    // event.detail 为当前输入的值
    this.setData({
      myclass: event.detail
    })
  },

  numberChange(event) {
    this.setData({
      number: event.detail
    })
  },

  usernameChange(event) {
    this.setData({
      username: event.detail
    })
  },

  onConfirm(event) {
    if (!this.data.myclass || !this.data.username || !this.data.number){
      Toast.fail('信息不能为空');
    }else{
      //数据库操作
      const db = wx.cloud.database()
      const todos = db.collection('userinfo')
      db.collection('userinfo').doc(this.data.user._id).update({
        data: {
          myclass: this.data.myclass,
          number: this.data.number,
          username: this.data.username
        },
        success: function (res) {
          Toast({
            type: 'success',
            message: '修改成功',
            onClose: () => {
              var pages = getCurrentPages()
              pages[0].onLoad()
              wx.switchTab({
                url: '../userInfo/userInfo',
              })
             }
          });         
        }
      })
    }
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