// pages/record/record.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    loading: false,
    created:[],
    attendActivity:[],
    imageURL:'https://s2.ax1x.com/2020/03/07/3jaLp4.th.png'
  },

  onActivityDetail(event){
    const id = event.target.dataset.id
    wx.navigateTo({
      url: '../activityDetail/activityDetail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        active: 1
      })
    }
    wx.setNavigationBarTitle({
      title: '活动列表'
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
  onShow: function (options) {
    const userid = app.globalData.openid
    const db = wx.cloud.database()
    //创建的活动
    db.collection('activity').orderBy('startDate', 'desc').where({
      _openid: userid,
    })
      .get({
        success: res => {
          console.log('我创建的活动：',res.data)
          this.setData({
            created: res.data
          })
        }
      })
    //参加的活动
    wx.cloud.callFunction({
      name:'attendActivitys',
      data:{
        userId:userid
      },
      success: res =>{
        var list = res.result.list
        var listReturn = list.reverse();
        console.log('参加的活动：',listReturn)
        this.setData({
          attendActivity:listReturn
        })
      },
    }) 

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