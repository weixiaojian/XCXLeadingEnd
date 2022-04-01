<script>
	// Author：DaiZuHua
	export default {
		onLaunch: function(options) {
			// this.$getPhoneDevices();  //获取手机信息
				 wx.getSetting({
				      success: res => {
				        if (res.authSetting['scope.userInfo']) {
				          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
				          uni.getUserInfo({
				            success: res => {
				              // 可以将 res 发送给后台解码出 unionId
				              this.globalData.userInfo = res.userInfo
				              
				              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
				              // 所以此处加入 callback 以防止这种情况
				              if (this.userInfoReadyCallback) {
				                this.userInfoReadyCallback(res)
				              }
				            }
				          })
				        }
				      }
				    })
			
			    const updateManager = uni.getUpdateManager()
			    updateManager.onCheckForUpdate(function (res) {
			      // 请求完新版本信息的回调
			      console.log(res.hasUpdate)
			      if(res.hasUpdate){
			        uni.showToast({
			          title: '新版本已经准备好，请进行更新~',
			          icon:'none',
			          duration:4000,
			        })
			      }
			    })
			    updateManager.onUpdateReady(function () {
			      uni.showModal({
			        title: '更新提示',
			        content: '新版本已经准备好，是否马上重启小程序？',
			        success: function (res) {
			          if (res.confirm) {
			            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
			            updateManager.applyUpdate()
			          }
			        }
			      })
			      // updateManager.applyUpdate()
			    })
			    updateManager.onUpdateFailed(function () {
			      // 新的版本下载失败
			      uni.showModal({
			        title: '发现新版本',
			        content: '请删除当前小程序，重新搜索打开...',
			      })
			    })
					// const updateManager = uni.getUpdateManager();
					// updateManager.onCheckForUpdate(function(res) {
					//    // 请求完新版本信息的回调
					//    if (res.hasUpdate) {
					//        updateManager.onUpdateReady(function(res2) {
					//            uni.showModal({
					//                title: '更新提示',
					//                content: '发现新版本，是否重启应用?',
					//                cancelColor:'#eeeeee',
					//                confirmColor:'#FF0000',
					//                success(res2) {
					//                    if (res2.confirm) {
					//                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					//                        updateManager.applyUpdate();
					//                    }
					//                }
					//            });
					//        });
					//    }
					// });
					
					// updateManager.onUpdateFailed(function(res) {
					//    // 新的版本下载失败
					//    uni.showModal({
					//        title: '提示',
					//        content: '检查到有新版本，但下载失败，请检查网络设置',
					//        success(res) {
					//            if (res.confirm) {
					//                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					//                updateManager.applyUpdate();
					//            }
					//        }
					//    });
					// });
					// let token = this.$getStorageSync('token')
					// if(token){
					// 	this.getWxGroupByOpenId()
					// }
		},
		onShow: function() {
			let self = this;
			// if(getCurrentPages().lengthrz
			// 	this.$checkToken(false);   //获取登录信息
			let token = this.$getStorageSync('token')
			if(token){
				self.getWxGroupByOpenId()
			}
			// }
			self.$checkToken()
		},
		onHide: function() {
			// console.log("onhide");
			// uni.hideLoading();
			// uni.hideToast();
		},
		methods: {
			getWxGroupByOpenId(){
				let self = this;
				let changeTeamModel;
				try {
					 changeTeamModel = Boolean(this.$getStorageSync('team-mode-changed'))
				} catch (e) {
					changeTeamModel = false
				}
				self.$api.getWxGroupByOpenId().then(res =>{
					console.log('res',res)
					if(res.code ==200){
						if(!res.data||res.data.status ==0){
							self.$setStorageSync('teamInfo','');
							self.$setStorageSync('teamModel','2');
						}else if(!changeTeamModel){
							self.$setStorageSync('teamModel','1');
							self.$setStorageSync('teamInfo',res.data)
						}
					}else{
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-PLUS-NVUE */
	@import url("@/common/iconfont/iconfont.css");
	@import "@/common/css/scan.scss";
	@import "@/common/css/address.scss";
	@import "@/common/css/init.scss";
    /* #endif*/
</style>
