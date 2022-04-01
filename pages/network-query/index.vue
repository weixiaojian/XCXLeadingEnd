<template>
	<view class="network">
		<view class="topq">
			<view class="local">
				<text>当前位置:</text>
				<view class="address" @tap="showMulLinkageThreePicker">
					{{provinces}}
				</view>
				<i class="iconfont rightIcon" v-html="'&#xe645;'"></i>
			</view>
			<view class="top-search">
				<view class="search-box">
					<InputSearch
					  :isLeft="true"
					  :isRight="false"
					  :itype="'text'"
					  :placeholder="'亲,请输入查询网点~'"
					  :boxStyle="boxStyle"
					  v-model="expressSearch"
					  @input="inputVal"
						@touchLeft="search"
					></InputSearch>
				</view>
			</view>
			
<!-- 			<view class="tco">
				<text @click="searcheve" class="iconfont icondaixuanzeicon"></text>
				<input v-model="Waybill"  class="uni-input"   placeholder="亲,可输入网点名称或派送地址查询哟"  />
			</view> -->	
			
		<!-- 	<view class="tri">
				<text @click="mapselect" class="iconfont iconyingyeshijianicon"></text>
			</view> -->
			
		</view>
	<view class="main">
		<view class="list" v-if="netlist.length>0">
			<block v-for="(item, index) in netlist" :key="index" >
				<view class="netitem">
					<view class="netd">
						<view class="title uni-ellipsis">{{item.siteName}}</view>
						<view class="distance">距离约 {{item.distance||''}} 米
						<text  class="iconfont iconyingyeshijianicon"></text>
						</view>
					</view>
					<view class="netdes">
						{{item.province}}{{item.city}}{{item.country||''}}{{item.address||''}}
					</view>
					<view class="netlx">
						<text class="iconfont iconlianxiwangdianicon"></text>
						<text>联系网点:{{item.salePhone||''}}</text>
					</view>
					<view class="netyy">
						<text class="iconfont iconyingyeshijianicon"></text>
						<text>营业时间: {{item.businessDate||''}}</text>
					</view>
				<!-- 	<view class="btns">
						<view class="button" v-if="item.blSignReturnbill=='1'">
							可签回单
						</view>
						<view class="button" v-if="item.blAllowAgentMoney=='1'">
							可签代收代款
						</view>
						<view class="button" v-if="item.blAllowTopayment=='1'">
							可到付款
						</view>
						<view class="button" v-if="item.blClass=='1'">
							可做中班
						</view>
					</view> -->
				</view>
			</block>
		</view>
		<view class="tips" v-else>
			暂无数据~
		</view>
		
	</view>
	
	<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
				   @onConfirm="onConfirm"></mpvue-city-picker>
	<view style="height: 60rpx;"></view>
		
	</view>
</template>

<script>
var _self;	
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	export default {
		data() {
			return {
				wzlond:{},
				Waybill:'',
				netlist:[],
				cityPickerValueDefault: [0, 0, 0],
				provinces:'请选择省市区',
				provincesCode:'',
				expressSearch:''
			}
		},
		onLoad() {
			_self = this;
			_self.getloc();
			
		},
		components:{
			mpvueCityPicker
		},
		methods: {
			getloc(){
				let self = this;
				uni.getLocation({
				    type: 'gcj02',
				    success: function (res) {
						console.log(res)
				        console.log('当前位置的经度：' + res.longitude);
				        console.log('当前位置的纬度：' + res.latitude);
						const latitude = res.latitude;
						const longitude = res.longitude;
						// uni.openLocation({
						// 		latitude: latitude,
						// 		longitude: longitude,
						// 		success: function () {
						// 				console.log('success');
						// 		}
						// });
					 self.wzlond.longitude = res.longitude;
					 self.wzlond.latitude = res.latitude;
					 let _data = {
						 latitude:res.latitude,
						 longitude:res.longitude,
						 pageNum:1,
						 pageSize:10,
						 search:''
					 }
					}
				});
			},
			showMulLinkageThreePicker(){
				this.$refs.mpvueCityPicker.show();
			},
			onConfirm(e){
				console.log(e)
				let self = this;
				self.provinces = e.label.replace(/-/ig,'/');
				self.provincesCode = e.code.replace(/-/ig,'/');
				self.getNetwork()
			},
			inputVal(val) {
				let self = this;
				this.$nextTick(function() {
					self.expressSearch = val
				})
			},
			search(){
				let self = this;
				if(self.expressSearch == ''){
					uni.showToast({icon:"none",title:"请输入工号或手机号码",duration:1500});
					return;
				};
				self.getNetwork()
			},
			getNetwork(){
				let self = this;
				let _data = {
					provice:'',
					city:'',
					country:'',
					'name':self.expressSearch||''
				}
				if(self.provinces !='请选择省市区'){
					_data.provice = self.provinces.split('/')[0]
					_data.city = self.provinces.split('/')[1]
					_data.country = self.provinces.split('/')[2]
				}
				self.$api.searchSite(_data).then(res =>{
					console.log(res)
					if(res.code ==200){
						self.netlist = res.data
					}
				})
			},
			showLoca(){
				//查看当前位置
				uni.openLocation({
					latitude: _self.wzlond.latitude,
					longitude: _self.wzlond.longitude,
					 success: function () {
							console.log('success');
					}
				});
			},
			mapselect(){
				uni.chooseLocation({
				    success: function (res) {
						_self.wzlond = res;
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
				    }
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.network{
		width: 100%;
		height: 100%;
		overflow: hidden;
		.tips{
			padding: 60rpx 0;
			text-align: center;
		}
		.topq{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			width: 100%;
			height: 170rpx;
			padding: 10rpx;
			margin: auto;
			background-color: #FFFFFF;
			.local{
				width: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding:0 20rpx ;
				height: 80rpx;
				text{
					color: #999;
					margin-right: 20rpx;
				}
				.address{
					margin-right: 10rpx;
				}
				.rightIcon{
					font-size:26rpx;
				}
			}
			.top-search{
				height:90rpx;
				background-color:#fff;
				width: 100%;
				padding:0 20rpx;
				.search-box{
					height: 86rpx;
				}
			}
			}	
			// 列表
			.main{
				height: calc(100% - 170rpx);
				width: 100%;
				overflow-y: auto;
				background-color:$ztd-color-bgcolor ;
				.netitem{
					background-color: #FFFFFF;
					margin-top: 20rpx;
					padding: 20rpx 20rpx;
					.netd{
						display: flex;
						.title{
							flex: 1;
							font-size: $ztd-title-size;
							color: $ztd-black-color;
							}
						.distance{
							font-size: $ztd-des-size;
							color: $ztd-grey-color;
							}	
						}
						.netdes{
							font-size:26rpx;
							color: $ztd-666-color;
							line-height: 40rpx;
							padding: 4rpx 0;
							}
						.netlx,.netyy{
							line-height: 40rpx;
							text{
								font-size: $ztd-des-size;
								color: $ztd-666-color;
								margin-left: 20rpx;
							}
						}	
						.netyy{
							text{
								color: $ztd-grey-color;
							}
						}
						.btns{
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							padding: 8rpx 0;
							.button{
								margin:0 8rpx;
								height: 50rpx;
								flex: 1;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 24rpx;
								border: 2rpx solid $ztd-pink-color;
								font-size: $ztd-des-size;
								color: $ztd-pink-color; 
								border-color: $ztd-pink-color ;
								border-radius: 8rpx;
								 }
							}
					}
			}
		
	}


</style>
