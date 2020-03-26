// pages/userInfo/userInfo.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    myclass: '',
    username:'',
    number:''

  },

 onHelp(){
   wx.navigateTo({
     url: '../help/help',
   })
 },

  onAbout(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  onSupport(){
    wx.previewImage({
      urls: ['https://7975-yunrun-m932d-1301662430.tcb.qcloud.la/qrcode.JPG?sign=fb459742c17e570b7676a9b1bed76a9a&t=1585047512'],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //数据库查询
    const openid = app.globalData.openid
    const db = wx.cloud.database()
    db.collection('userinfo').where({
      _openid: openid,
    })
      .get({
        success: res => {
          this.setData({ user: res.data[0] })
        }
      })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
              })
            }
          })
        }
      }
    })
  },

  getuserinfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        avatarUrl: e.detail.userInfo.avatarUrl,
      })
    }
    this.setData({ show: true });

  },

  changeInfo() {
    wx.navigateTo({
      url: '../changeInfo/changeInfo',
    })
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },


  classChange(event) {
    // event.detail 为当前输入的值
    this.setData({
      myclass:event.detail
    })
  },

  numberChange(event) {
    this.setData({
      number:event.detail
    })
  },

  usernameChange(event) {
    this.setData({
      username:event.detail
    })
  },

  onConfirm(event) {
    if(!this.data.myclass||!this.data.username||!this.data.number){
      Toast.fail('信息不能为空');
    }else{
      //数据库操作
      const db = wx.cloud.database()
      const userinfo = db.collection('userinfo')
      db.collection('userinfo').add({
        data:{
          myclass:this.data.myclass,
          username:this.data.username,
          number:this.data.number,
          avatarUrl:this.data.avatarUrl
        }
      }).then(res =>{
        Toast.success('保存成功！')
        this.setData({ show: false });
        this.onLoad()
      })
    }
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