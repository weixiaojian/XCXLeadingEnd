<template>
	<view class="excelMail">
		<view class="excelMail-image"><image src="/static/i-topimg.jpeg" mode=""></image></view>
		<TabLists>
			<view class="excelMail-step">
				<!-- 第一步 -->
				<view class="excelMail-step-tit">
					<!-- 标题 -->
					<view class="excelMail-step-tit-name">第1步: 请按以下格式填写Excel</view>
					<view class="">或者复制<text class="warningTo" @click="templateTap">模板下载</text>链接后在电脑浏览器下载模板并填写</view>
					<view>一次最多支持500条数据导入</view>
					<image src="/static/img/WechatIMG40.png" mode=""></image>
				</view>
				<!-- 第二步 -->
				<view class="excelMail-step-tit">
					<view class="excelMail-step-tit-name">第2步: 发送Excel给微信好友或自己</view>
					<image src="/static/img/WechatIMG41.png" mode=""></image>
				</view>
				<!-- 第三步 -->
				<view class="excelMail-step-tit">
					<view class="excelMail-step-tit-name">第3步: 上传Excel</view>
					<view class="">
						<view>点击“上传Excel”</view>
						<view>找到微信聊天内容中的Excel、即可完成寄件信息人</view>
					</view>
				</view>
			</view>
		</TabLists>
		<view class="excelMail-button">
			<ButtonBox :title="'上传Excel'" :radius="'35rpx'" height="70rpx" width="650rpx" @hanldChange="ChangeBtn"></ButtonBox>
		</view>
		
		<Loading :loadShow="loadShow" :text="'数据正在上传中'"></Loading>
	</view>
</template>

<script>
	import {baseUrl} from '@/common/url/index.js'
	export default {
		data() {
			return {
				token: '',
				fileName: '',
				loadShow: false
			};
		},
		onLoad() {
			this.token = this.$getStorageSync('token');
			let userData = this.$getStorageSync('userData')
			if(typeof(userData) == "undefined"){
				uni.showModal({
					title:"提示",
					content:"请先登录授权~",
					success:function(res) {
						if(res.confirm) {
							uni.switchTab({
								url:"/pages/tabbar/my/index?pageId=send"
							})
						}else if(res.cancel){
							uni.switchTab({
								url:"/pages/tabbar/home/index?pageId=send"
							})
						}
					}
				})
				return false;
			}
		},
		methods: {
			// 上传Excel
			ChangeBtn() {
				
				// uni.navigateTo({
				// 	url: 'orderExcel'
				// })
				// 从客户端会话选择文件
				wx.chooseMessageFile({
					count: 1,
					extension: ['xlsx', 'xls'],
					type: 'file',
					success:(res)=>{
						this.loadShow=true
						this.fileName = res.tempFiles[0].name
						console.log('res.tempFiles[0].path', res.tempFiles[0].path);
						wx.uploadFile({
							//url: baseUrl+'/order/importExcel',
							url: 'http://192.168.3.200:17771/xcx/tabWeChatController/uploadfastdfs',
							filePath: res.tempFiles[0].path,
							name: 'file',
							formData:{
								'name': 'test',
								'phone': '123'
							},
							header: {
								'content-type': 'multipart/form-data',
								'WxAuthorization': this.token
							},
							success:(uploadFile)=>{
								this.loadShow=false
								console.log('uploadFile', uploadFile);
								let data = JSON.parse(uploadFile.data);
								if(data.code != 200) {
									uni.showToast({
										icon: 'none',
										title: data.message,
										duration:5000
									})
								} else {
									console.log(data.data)
									uni.navigateTo({
										url: 'excelTo?fileName='+this.fileName+'&order='+JSON.stringify(data.data)
									})
								}
							}
						})
					}
				})
			},
			// 模版下载
			templateTap() {
				uni.setClipboardData({
					data: baseUrl + '/order/excelTemplate/XCXTemplate.xlsx',
					success: function() {
						console.log('success');
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.excelMail {
		width: 100%;
		height: 100%;
		background-color: $ztd-color-bgcolor;
		
		&-image {
			width: 100%;
			height: 320rpx;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		&-step {
			display: inline-block;
			text-align: center;
			
			&-tit {
				padding: 10rpx 0;
				
				&-name {
					color: $ztd-color-primary;
					font-size: 30rpx;
					font-weight: 500;
					margin-bottom: 20rpx;
				}
				
				.warningTo {
					color: $ztd-color-warning;
					margin: 0 10rpx;
					text-decoration: underline;
				}
				
				image {
					width: 100%;
					height: 120rpx;
					margin-top: 10rpx;
				}
			}
		}
		
		&-button {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: $ztd-color-white;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 18rpx 18rpx 0 0;
		}
	}
</style>
