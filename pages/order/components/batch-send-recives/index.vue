<template>
	<view class="batch-send-recives">
		<!-- 收寄件信息 -->
		<view class="user-info">
			<view class="user-info-row" @tap.stop.prevent="getNewAddress('jjr')">
				<view  class="oiconbox"> 
					<text class="oicon jj">寄</text>
				</view>
				<view class="botline">
					<view class="send infobox">
						<view class="realname" @tap.stop="realnameMethod" v-if="realName">
							立即实名
						</view>
						<template v-if="addressDataJJ.name">
							<view class="name-box">
								<view class="name uni-ellipsis">{{addressDataJJ.name}}</view>
								<view class="tell uni-ellipsis">{{addressDataJJ.phone}}</view>
							</view>
							<view class="name-box">
								<view class="company uni-ellipsis">{{addressDataJJ.company}}</view>
							</view>
							<view class="address uni-ellipsis-2">
								{{addressDataJJ.provice}}{{addressDataJJ.city||''}}{{addressDataJJ.country||''}}{{addressDataJJ.detailAddress}}
							</view>
						</template>
						<view class="instructions" v-else>
							<view class="name">请选择寄件地址</view>
						</view>
					</view>
					<view class="addreIcon" @tap.stop="myaddress(0)">
						<i class="iconfont" v-html="'&#xe65a;'"></i>
						<view class="text">
							地址簿
						</view>
					</view>
				</view>
			</view>
			<view class="row" v-if="sendType=='sends'">
				<view class="name">付款方式</view>
				<view class="content">
					<picker  @change="bindPickerChange"  style="font-size: 28rpx;"  mode = selector :range="mockList" range-key="name">
							<view class="text">
									{{payment_type||'请选择'}}
							</view>
					</picker>
					<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
				</view>
			</view>
		</view>
			
			<view class="user-info rec" v-if="addressDataSJs.length>0&&sendType=='sends'" v-for="(item,index) in addressDataSJs" :key="index" >
					<view class="user-info-row " >
						<view class="oiconbox">
							<text class="oicon sj">{{index+1}}</text>
						</view>
						<view class="rec infobox">
							<template >
								<view class="name-box">
									<view class="name uni-ellipsis">{{item.address.name}}</view>
									<view class="tell uni-ellipsis">{{item.address.phone}}</view>
								</view>
								<view class="name-box">
									<view class="company uni-ellipsis">{{item.address.company}}</view>
								</view>
								<view class="address uni-ellipsis-2">
									{{item.address.provice}}{{item.address.city||''}}{{item.address.country||''}}{{item.address.detailAddress}}
								</view>
							</template>
						</view>
						<view class="addreIcon rec">
							<i class="iconfont " v-html="'&#xe65a;'" @tap="getNewAddress('sjr',index)"></i>
							<i class="iconfont " v-html="'&#xe641;'" @tap="deleteRec(index)"></i>
						</view>
					</view>
					<view class="goods-info">
						<view class="info-l">
							<text>物品信息</text>
							<view class="info-l" @click="getGoodsInfo(index,'wpxx')">
									<view class="text uni-ellipsis">
										{{item.showGoods}}
									</view>
									<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
							</view>
						</view>
						<view class="info-r">
							<text>增值&代收</text>
							<view class="info-r" @click="getGoodsInfo(index,'zzfw')">
									<view class="text uni-ellipsis">
										{{item.showServices}}
									</view>
									<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
							</view>
						</view>
					</view>
			</view>
			<view class="addRecives"  v-if="sendType=='sends'">
				<i class="iconfont hicon" v-html="'&#xe659;'" ></i>
				<text class="add" @tap.stop="myaddress(1)">增加收件人</text>
			</view>
	</view>
</template>

<script>
	let self;
	export default {
		props:{
			addressDataSJ:{
				type:Array,
				default:()=>{
					return []
				}
			},
			addressDataJJ:{
				type:Object,
				default:()=>{
					return {}
				}
			},
			realName:{
				type:Boolean,
				default:false
			},
			sendType:{
				type:String,
				default:()=>{
					return 'sends'
				}
			}
		},
		data() {
			return {
				payment_type:'现金',
				init_services:'请填写',
				mockList:this.$Mock.payment_type,
			}
		},
		created(){
			self = this;
		},
		computed:{
			addressDataSJs(){
				 this.addressDataSJ.forEach(item =>{
					 item.showGoods = item.goodsInfo.goodsName?`${item.goodsInfo.goodsName} ${item.goodsInfo.goodsWeight}KG ${item.goodsInfo.remark||''}`:'请选择';
					 item.showServices = this.init_services
					 if(item.goodsInfo.goodsPayment||item.goodsInfo.rBillcode||item.goodsInfo.blIndenture!=null){
						  item.showServices = `${item.goodsInfo.goodsPayment||''} ${item.goodsInfo.rBillcode||''} ${item.goodsInfo.blIndenture =='0'?'不签回单':'签回单'}`
					 }
				})
				
				return this.addressDataSJ
			}
		},
		mounted(){
			
		},
		destroyed(){
		},
		methods: {
			// 地址博
			myaddress(tabIndex){
				let obj = {tabIndex}
				this.$emit('myaddress',obj);
			},
			// 批量收件人物品信息
			getGoodsInfo(index,type){
				let obj = {index,type}
				this.$emit('getGoodsInfo',obj)
			},
			//实名认证
			realnameMethod(){
				this.$emit('realnameMethod');
			},
			//删除收件人
			deleteRec(index){
				this.$emit('deleteRec',index)
			},
			// 地址详情
			getNewAddress(pageId,index){
				let obj = {pageId,index}
				this.$emit('newaddress',obj);
			},
			bindPickerChange(e){
				let val = e.detail.value;
				this.payment_type = this.$Mock.payment_type[val].name;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.batch-send-recives{
		width: 100%;
		height: auto;
		padding: 20rpx;
		.placeholderStyle{
			font-size: 26rpx;
			color:$ztd-color-listfont;
		}
		.uni-input{
		 padding:12rpx 0;
		 font-size: 26rpx;
		 height: 100%;
		}
		.user-info{
			background-color:$ztd-color-white;
			width: 100%;
			height: auto;
			padding:0 20rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			&-row{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: auto;
				padding: 16rpx 0;
				.oiconbox{
					width: 80rpx;
				}
				.botline{
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex: 1;
					padding-bottom: 12rpx;
				}
				.infobox{
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					width: 100%;
					// height: 100%;
					height: 130rpx;
					// min-height: 120rpx;
					border-right: 2rpx solid $ztd-color-line;
					.realname{
						position: absolute;
						top: 0;
						// right: -90rpx;
						right: 10rpx;
						font-size: 24rpx;
						color: $ztd-color-warning;
						height: 32rpx;
						padding: 0 10rpx;
						line-height: 26rpx;
						border: 2rpx solid $ztd-color-warning;
						border-radius: 16rpx;
					}
					.instructions{
						display: flex;
						// justify-content: center;
						padding-left: 40rpx;
						align-items: center;
						width: 100%;
						height: 100%;
						
						.name{
							font-size: 30rpx;
							color:$ztd-color-listfont;
						}
					}
					.name-box{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						width: 100%;
						.name{
							width: 120rpx;
							margin-right: 10rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
						.company{
							flex: 1;
							margin-right: 10rpx;
							// font-size: 30rpx;
						}
						.tell{
							flex: 1;
							margin-right: 10rpx;
							font-size: 28rpx;
							font-weight: bold;
						}
					}
					.address{
						margin-top:6rpx;
						font-size: 24rpx;
						color: $ztd-color-listfont;
					}
				}
				.infoIcon{
					font-size: 32rpx;
					margin-right: 20rpx;
				}
				.addreIcon{
					font-size: 56rpx;
					width: 108rpx;
					height: 100%;
					color: $ztd-color-primary;
					padding-left: 20rpx;
					padding-right: 10rpx;
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					.text{
						color: #6d6d6d;
					}
				}
				.addreIcon.rec{
					width: 130rpx;
					flex-direction:row;
					padding: 0;
					.iconfont{
						margin-left: 20rpx;
						font-size:36rpx;
					}
				}
				.rightIcon{
					font-size: 32rpx;
					padding-right: 20rpx;
					color: $ztd-color-listfont;
					border-right: 2rpx solid $ztd-color-line;
				}
			}
			.operate-button{
				width: 210rpx;
				border: 2rpx solid $ztd-color-primary;
				height:50rpx;
				border-radius:50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: $ztd-color-primary;
				margin-left: 10rpx;
				font-size: 26rpx;
			}
			.row:last-child{
				border-bottom: none;
			}
		}
		.user-info.rec{
			.user-info-row {
				border-bottom: 2rpx solid $ztd-color-line;
			}
			.goods-info{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 0;
				text{
					font-size: 28rpx;
				}
				.info-r,.info-l{
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.iconfont{
						font-size: 26rpx;
					}
					text{
						font-size: 26rpx;
						font-weight: bold;
					}
					.text{
						max-width: 164rpx;
						margin-right:10rpx;
						font-size: 24rpx;
					}
				}
				.info-l{
					border-right: 2rpx solid $ztd-color-listfont;
					.iconfont{
						margin-right: 10rpx;
					}
				}
				.info-r{
					text{
						padding-left: 20rpx;
					}
				}
			}
		}
		.addRecives{
			background-color: $ztd-color-white;
			padding: 20rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			text{
				margin-left: 20rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #444;
			}
		}
		.row{
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding:16rpx 0;
			border-top: 2rpx solid  $ztd-color-line;
			picker{
				width: 100%;
				height: auto;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}
			.name{
				font-size: 28rpx;
				height: 50rpx;
				line-height: 50rpx;
				margin-right: 10rpx;
			}
			.content{
				flex: 1;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.text{
					color: #999;
					margin-right: 20rpx;
					input{
						text-align: right;
					}
				}
				.text-button{
					background-color:$ztd-btn-bgcolor;
					color: $ztd-color-primaryfont;
					padding: 6rpx 26rpx;
					border-radius: 10rpx;
					margin-left: 20rpx;
					font-size: 26rpx;
				}
			}
			.iconfont{
				font-size: 26rpx;
				color: #999;
			}
		}
		// .row{
		// 	width: 100%;
		// 	display: flex;
		// 	justify-content: flex-start;
		// 	align-items: center;
		// 	padding:10rpx 10rpx;
		// 	border-bottom: 2rpx solid $ztd-color-line;
		// 	.name{
		// 		font-size: 26rpx;
		// 		height: 50rpx;
		// 		line-height: 50rpx;
		// 		margin-right: 10rpx;
		// 	}
		// 	.content{
		// 		flex: 1;
		// 		display: flex;
		// 		justify-content: space-between;
		// 		align-items: center;
		// 		.input-box{
		// 			flex: 1;
		// 		}
		// 		.text-button{
		// 			background-color:$ztd-color-bgcolor;
		// 			color: $ztd-color-primaryfont;
		// 			padding: 6rpx 26rpx;
		// 			border-radius: 10rpx;
		// 			margin-left: 20rpx;
		// 			font-size: 26rpx;
		// 		}
		// 	}
		// 	.iconfont{ }
		// }
	}
</style>
