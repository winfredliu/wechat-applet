// components/header.js
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    Color: {
      type: String,
      value: "#FF4040",
    },
    Height: {
      type: Number,
      value: app.globalData.StatusBar / ( app.globalData.Customwidth / 750 ) + 88,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: wx.getSystemInfoSync().statusBarHeight,
    Custom: app.globalData.Custom,
    Height: app.globalData.StatusBar / ( app.globalData.Customwidth / 750 ) + 88,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    BackPage(){
      wx.navigateBack({
        delta:1
      })
    }
  }
})
