// pages/signUp/signUp.js
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: new Date().getTime(),
    imageURL: 'https://s2.ax1x.com/2020/03/07/3jaLp4.th.png',
    attendPeople: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '参加活动',
    })

    this.setData({
      activityId: options.scene
    })
    //判断是否需要完善信息
    if (!app.globalData.openid) {
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
    }


    // 获取用户授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          const db = wx.cloud.database()
          //查询活动信息
          db.collection('activity').where({
            _id: this.data.activityId
          }).get({
            success: res => {
              this.setData({
                activity: res.data[0]
              })
              if (res.data[0].people) {
                //查询活动人数
                wx.cloud.callFunction({
                  name: 'attendusers',
                  data: {
                    activityId: this.data.activityId
                  },
                  success: res => {
                    var attendPeople = res.result.list[0].attendList.length
                    this.setData({
                      attendPeople,
                    })
                  }
                })
              }

            },
            fail: err => {
              console.error('[查询活动信息错误]：' + err)
            }
          })

        } else {
          console.log('没有使用过小程序')
          Dialog.alert({
            title: '提示',
            message: '首次使用请完善个人信息'
          }).then(() => {
            wx.switchTab({
              url: '../userInfo/userInfo',
            })
          });
        }
      }
    })
  },

  onConfirm() {
    const {
      latitude,
      people
    } = this.data.activity
    const {
      attendPeople
    } = this.data
    if (!latitude) {
      if (!people || people > attendPeople) {
        //弹窗确认
        Dialog.confirm({
            title: '确认参加',
            message: `您是否要参加"${this.data.activity.activeTitle}"？`,
            asyncClose: true
          })
          .then(() => {
            //添加活动成员
            var id = this.data.activity._id
            var openid = app.globalData.openid
            wx.cloud.callFunction({
              name: 'addMember',
              data: {
                id,
                openid,
              },
              success: res => {
                Dialog.close();
                wx.switchTab({
                  url: '../record/record',
                })
              }
            })
          })
          .catch(() => {
            Dialog.close();
          });
      } else if (attendPeople > people || attendPeople == people) {
        Dialog.alert({
          title: '签到失败',
          message: '已参加活动人数已达上限！'
        }).then(() => {
          // on close
        });
      }
    } else if (latitude) {
      Toast.loading({
        mask: true,
        message: '加载中...'
      });
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          console.log('手机定位：', res)
          const {
            latitude,
            longitude
          } = this.data.activity
          wx.cloud.callFunction({
            name: 'locationCheckin',
            data: {
              from_latitude: res.latitude,
              from_longitude: res.longitude,
              to_latitude: latitude,
              to_longitude: longitude
            },
            success: res => {
              var positionString = JSON.parse(res.result)
              var distance = positionString.result.elements[0].distance
              console.log('云函数-距离：', positionString.result)
              var {
                locationRange
              } = this.data.activity

              if (locationRange < distance) {
                Dialog.alert({
                  title: '提示',
                  message: '不在签到范围内，请靠近活动地址后再试！'
                }).then(() => {
                  // on close
                });
              } else if (locationRange > distance) {
                if (!people || people > attendPeople) {
                  var id = this.data.activity._id
                  var openid = app.globalData.openid
                  wx.cloud.callFunction({
                    name: 'addMember',
                    data: {
                      id,
                      openid,
                    },
                    success: res => {
                      wx.switchTab({
                        url: '../record/record',
                      })
                    }
                  })
                } else {
                  Dialog.alert({
                    title: '签到失败',
                    message: '已参加活动人数已达上限！'
                  }).then(() => {
                    // on close
                  });
                }
              }
            }
          })
        }
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