let app = getApp()
Component({
  properties: {
    mode: {
      type: String,
      value: "two"
    },
    data: {
      type: Array,
      value: []
    }
  },
  methods: {
    detail(e) {
      let product = e.currentTarget.dataset.info
      app.$comm.navigateTo("/pages/product-detail/product-detail?id=" + product._id)
    }
  }
})