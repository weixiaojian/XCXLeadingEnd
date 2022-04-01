<template>
	<view class="excelOk">
		<view class="excelOk-show">
			<view class="excelOk-show-top">
				<image src="/static/img/order-Ok.png"></image>
				<view class="myExcel">Excel文件导入成功</view>
				<view class="myBtom">上传<text>{{ ListOrder.total }}</text>个</view>
				<view class="myBtom">成功解析<text>{{ ListOrder.successTotal }}</text>个</view>
				<view class="myBtom">错误解析<text class="warning-color">{{ ListOrder.errorTotal }}</text>个</view>
			</view>
			<view class="excelOk-show-main">
				<view class="excelOk-show-main-file">
					<view class="excelOk-show-main-file-template">
						<image src="/static/img/ExcelTo.png" mode=""></image>
						<view class="excelOk-show-main-file-template-name">{{ excelArr.excelName }}</view>
					</view>
					<view class="excelOk-show-main-file-btn" @click="againUpload">重新上传</view>
				</view>
				<view class="excelOk-show-main-line"></view>
				<view class="excelOk-show-main-list">
					<view class="" v-for="(item, index) in ListOrder.errorList" :key="index">{{ item.msg }}</view>
				</view>
			</view>
			<view class="excelOk-show-button">
				<ButtonBox :title="'确认订单'" :radius="'35rpx'" height="70rpx" width="650rpx" @hanldChange="ChangeBtn"></ButtonBox>
			</view>
		</view>
		<Loading :loadShow="loadShow" :text="'数据正在上传中'"></Loading>
	</view>
</template>

<script>
	import {baseUrl} from '@/common/url/index.js'
	export default {
		data() {
			return {
				excelArr: {
					uploadNum: 0,
					succNum: 0,
					errNum: 0,
					excelName: ''
				},
				ListOrder: {},
				token: '',
				loadShow: false
			};
		},
		onLoad(options) {
			console.log(options)
			this.ListOrder = JSON.parse(options.order)
			this.excelArr.excelName = options.fileName
		},
		onShow() {
			this.token = this.$getStorageSync('token');
		},
		methods: {
			// 重新导入
			againUpload() {
				// 从客户端会话选择文件
				wx.chooseMessageFile({
					count: 1,
					extension: ['xlsx', 'xls'],
					type: 'file',
					success:(res)=>{
						this.loadShow=true
						wx.uploadFile({
							//url: baseUrl+'/order/importExcel',
							url: 'http://192.168.3.198:17771/xcx/tabWeChatController/uploadfastdfs',
							filePath: res.tempFiles[0].path,
							name: 'file',
							header: {
								'content-type': 'multipart/form-data',
								'WxAuthorization': this.token
							},
							success:(uploadFile)=>{
								this.loadShow=false
								// console.log('uploadFile', uploadFile);
								let data = JSON.parse(uploadFile.data);
								if(data.code != 200) {
									wx.showToast({
										icon: 'none',
										title: data.message,
										duration: 8000
									})
								} else {
									// uni.navigateTo({
									// 	url: 'excelTo?fileName='+this.fileName+'&order='+JSON.stringify()
									// })
									// 直接赋值
									this.ListOrder = data.data
									this.excelArr.excelName = res.tempFiles[0].name
								}
							}
						})
					}
				})
			},
			// 确定订单
			ChangeBtn() {
				uni.navigateTo({
					url: 'orderExcel?order=' + JSON.stringify(this.ListOrder.successList)+'&pageId=excel'
				})
			}
		}
	}
</script>

<style lang="scss">
	.excelOk {
		width: 100%;
		height: 100%;
		background-color: $ztd-color-bgcolor;
		padding: 20rpx;

		&-show {
			width: 100%;
			background: $ztd-color-white;
			border-radius: $ztd-border-radius;
			padding: 20rpx;
			box-shadow: $ztd-shadow;
			
			&-top {
				width: 100%;
				margin: 80rpx auto 30rpx;
				text-align: center;
				
				image {
					width: 120rpx;
					height: 120rpx;
				}
				
				.myBtom {
					margin-bottom: 20rpx;
					color: $ztd-color-listfont;
					font-size: 28rpx;
					
					text {
						font-size: 32rpx;
						color: $ztd-color-back;
						margin: 0 5rpx;
					}
					
					.warning-color {
						color: $ztd-color-warning;
					}
				}
				
				.myExcel {
					margin: 40rpx 0;
					color: $ztd-color-back;
					font-weight: bold;
					font-size: 34rpx;
				}
			}
			
			&-main {
				background-color: $ztd-color-bgcolor;
				overflow-x: hidden;
				border-radius: 18rpx;
				
				&-file {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 20rpx;
					&-template {
						display: flex;
						align-items: center;
						
						image {
							width: 40rpx;
							height: 40rpx;
							margin-right: 20rpx;
						}
						
						&-name {
							font-size: 32rpx;
							font-weight: 500;
						}
					}
					
					&-btn {
						width:180rpx;
						padding: 10rpx 0;
						border-radius: 35rpx;
						background-color:$ztd-color-primary ;
						color: $ztd-color-block;
						text-align: center;
						font-size: 28rpx;
					}
				}
				
				&-line {
					width: 100%;
					height: 2rpx;
					background-color: $ztd-color-line;
					margin-top: 20rpx;
					margin-bottom: 20rpx;
					margin-left: 60rpx;
				}
				
				&-list {
					margin-left: 60rpx;
					margin-right: 20rpx;
					height: 300rpx;
					overflow-y: auto;
					view {
						margin-bottom: 10rpx;
						font-size: 26rpx;
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
				font-weight: bold;
			}
		}
	}
</style>
