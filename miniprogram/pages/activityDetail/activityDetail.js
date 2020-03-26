// pages/activityDetail/activityDetail.js
import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageURL:'https://s2.ax1x.com/2020/03/07/3jaLp4.th.png',
    activityDetail:'',
    active:'attend',
    attendList:[],
    qrcode:'',
    studentID:'',
    addStudent:''
  },

  onStudentID(event){
    this.setData({
      studentID:event.detail
    })
  },
  
  onSearch(){
    const db = wx.cloud.database()
    db.collection('userinfo').where({
      number: this.data.studentID,
    })
    .get({
      success: res=> {
        var student = res.data[0]
        if(!student){
          Toast.fail('学号输入错误或该用户没有完善信息');
        }else{
          this.setData({
            addStudent: student
          })
        }
       
      }
    })
  },
  onStudentAdd(){
    var id = this.data.activityDetail._id
    var openid = this.data.addStudent._openid
    wx.cloud.callFunction({
      name:'addMember',
      data:{
        id,
        openid
      },
      success: res =>{
        Toast.success('添加成功');
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    this.setData({
      activityId:options.id
    })

    wx.setNavigationBarTitle({
      title: '活动详情',
    })


    //活动详情
    const db = wx.cloud.database()
    const activity = db.collection('activity')
    activity.doc(options.id).get({
      success: res => {
        // res.data 包含该记录的数据
        this.setData({
          activityDetail:res.data
        })
      }
    })


    //参与人员
    wx.cloud.callFunction({
      name: 'attendusers',
      data:{
        activityId:this.data.activityId
      },
      success: res => {
        const attendListReturn = res.result.list[0].attendList
        const attendList = attendListReturn.reverse()
        console.log('已参加活动成员：',attendList)
        this.setData({
          attendList
        })
        Notify({ type: 'success', message: '下拉刷新成员名单' });
      }
    })

    //二维码
    var path = 'pages/signUp/signUp'
    var width = '430';
    wx.cloud.callFunction({
      name: 'qrcode',
      data: {
        page: path,
        width: width,
        scene: this.data.activityId,
      },
      success: res => {
        console.log('活动二维码数据：', res.result[0])
        const qrcode = res.result[0].tempFileURL 
        this.setData({
            qrcode
        })
      },
      fail: error => {
        console.log(JSON.stringify(error))
      }
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
    const activityId = this.data.activityId
    wx.showNavigationBarLoading()//在标题栏中显示加载
    //加载数据
    wx.cloud.callFunction({
      name: 'attendusers',
      data: {
        activityId
      },
      success: res => {
        const attendList = res.result.list[0].attendList
        this.setData({
          attendList
        })
        wx.hideNavigationBarLoading()//完成停止加载
        wx.stopPullDownRefresh()//停止下拉刷新
      }
    })
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