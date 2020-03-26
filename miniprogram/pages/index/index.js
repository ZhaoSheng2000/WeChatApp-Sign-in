// pages/index/index.js
import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  addEvent() {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          Dialog.alert({
            message: '请先完善个人信息！'
          }).then(() => {
            wx.switchTab({
              url: '../userInfo/userInfo',
            })
          });
        }
        else{
          wx.navigateTo({
            url: '../createEvent/createEvent',
          })
        }
      }
    })
  },
  signEvent() {
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        wx.navigateTo({
          url: `../../${res.path}`,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 调用云函数，获取openid
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
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
  onPullDownRefresh: function() {},

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