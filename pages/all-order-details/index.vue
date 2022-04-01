<template>
	<view class="allDetails" @click="hidenHistory">
		<view class="map-wraper">
			<view class="search-box">
				<InputSearch :isLeft="false" @focus="focus" :isRight="true" :itype="'text'" :placeholder="'亲,可输入运单号码查询哟'"
					:boxStyle="boxStyle" v-model="billCode"   @input="inputVal" @touchRight="getTrackVOList">
				</InputSearch>
			</view>
			<!-- <text class="cancel_hi" v-if="isHistory" @click="cancelHis">取消</text> -->
			<view class="history" v-if='isHistory' @click.stop="">
				<view class="title_hi"><text>搜索历史</text><image @click.stop="empty"  src="/static/img/dele.png"></image></view>
				<view class="his_item" v-for="(item,index) in historyList" :key="index" @click="getHistoryItem(item)" >
					<text >{{item}}</text>
				</view>
			</view>
		</view>
		<view class="unlist" v-if="hasBill">
			<image src="/static/img/undata.png" alt="" />
			<view>暂无轨迹数据~</view>
		</view>
		<view class="steps-wraper" v-else>
			<!--  wx:for='{{billTrack}}' wx:key="index" data-id='{{index}}' -->
			<view class="track_wraper" v-for="(item,index) in trackData" :key="index">
				<view class="time">
					<view class="view-p">{{item.scanDate2}}</view>
					<view class="view-p">{{item.scanDate3}}</view>
				</view>
				<view class="express_word">
					<text class="express_word_icon"></text>
					<view class="express_word_text">
						<!-- <view class="view-p" ><text class="mgr_5">【xxxxxxx】</text>已收件,取件人:xxxxxxx</view> -->
						<view class="view-p" v-if="item.scanType=='收件'"><text
								class="mgr_5">【{{item.scanSite||''}}】</text>已收件,取件人:{{item.scanMan||''}}({{item.phone||''}})
						</view>
						<view class="view-p" v-if="item.scanType=='到件'">快件到达<text
								class="mgr_5">【{{item.scanSite||''}}】</text></view>
						<view class="view-p" v-if="item.scanType=='发件'"><text
								class="mgr_5">【{{item.scanSite||''}}】</text>已发出,准备发往<text
								class="mgr_5">【{{item.preOrNextStation||''}}】</text></view>
						<view class="view-p" v-if="item.scanType=='派件'"><text
								class="mgr_5">【{{item.scanSite||''}}】</text>派件中, 派件人: <text
								class="mgr_5">【{{item.scanMan||''}}】</text>,电话:<text
								class="mgr_5">【{{item.phone||''}}】</text>如有疑问,请联系:<text
								class="mgr_5">【{{item.preOrNextStation||''}}】</text></view>
						<view class="view-p" v-if="item.scanType=='签收'">您的快件已在<text
								class="mgr_5">【{{item.scanSite||''}}】</text>签收,签收人： {{item.scanMan||''}}，如有疑问请联系: 
							{{item.phone||''}}, 投诉电话：{{item.preOrNextStation||''}}</view>
						<view class="view-p" v-if="item.scanType=='问题件'">快件已进行<text
								class="mgr_5">【{{item.scanType||''}}】</text>登记,登记网点是【{{item.scanSite||''}}】，登记人是【{{item.scanMan||''}}】;</view>
						<view class="view-p" v-if="item.scanType=='异常签收'">快件已<text
								class="mgr_5">【{{item.scanType||''}}】</text>,签收网点是【{{item.scanSite||''}}】，签收人是【{{item.scanMan||''}}】;</view>
						<view class="view-p" v-if="item.scanType=='退件'">快件已做<text
								class="mgr_5">【{{item.scanType||''}}】</text>,录入网点是【{{item.scanSite||''}}】，退件人是【{{item.scanMan||''}}】;</view>
						<view class="view-p" v-if="item.scanType=='拦截'">快件在【{{item.scanSite||''}}】进行运单拦截操作;
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				billCode: '',
				hasBill: true,
				pageId: '',
				type: '',
				trackData: [],
				isHistory:false,
				historyList:[],
				hisTime:''
			}
		},
		onLoad(option) {
			let self = this;
			let historyData;
			 try{
				historyData = JSON.parse(self.$getStorageSync('historyList'));
			}catch(err){
				console.log(err)
			}
			if(historyData){
				self.historyList = historyData;
			}
		},
		computed: {},
		onShow() {},
		methods: {
			inputVal(val) {
				let self = this;
				this.$nextTick(function() {
					self.billCode = val.replace(this.$Reg.RegOrder, '');
				})
			},
			hidenHistory(){
				let self = this;
				self.isHistory = false
			},
			focus(){
				let self = this;
				self.isHistory = true;
			},
		 empty(){
			 let self = this;
				 uni.showToast({
					title:'清楚历史成功',
					icon: 'none',
					duration: 1500
				 })
				self.$removeStorageSync('historyList')
				this.historyList = [];
			},
			getHistoryItem(item){
				let self = this;
				self.billCode = item;
				self.isHistory = false;
				self.getTrackVOList()
			},
			getTrackVOList(code) {
				let self = this
				 if(self.billCode == ''){uni.showToast({icon:"none",title:"请输入运单号"});return;};
				 // 没有搜索记录，把搜索值push进数组首位，存入本地
				 if (!this.historyList.includes(this.billCode)) {
					 this.historyList.unshift(this.billCode);
					 self.$setStorageSync('historyList',JSON.stringify(this.historyList))
				 }else{
						 //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
						 let i =this.historyList.indexOf(this.billCode);
						 this.historyList.splice(i,1)
						 this.historyList.unshift(this.billCode);
						 self.$setStorageSync('historyList',JSON.stringify(this.historyList))
				 }
				let data = {
					billCode: self.billCode
				}
				self.$api.getTrajectory(data).then(res => {
					console.log(res)
					if (res.code == 200) {
						if (res.data.length > 0) {
							self.hasBill = false;
							self.trackData = res.data;
						}
					} else if (res.code == 400) {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 3000
						})
						this.hasBill = true
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.allDetails {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		position: relative;
		.map-wraper {
			width: 100%;
			height: 120rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 2rpx solid $ztd-color-line;
			background-color: #eee;
			.search-box{
				flex: 1;
				height: 80rpx;
			}
			.history{
			  position: fixed;
			  top:92rpx;
			  left:0;
			  width:100%;
			  height: 500rpx;   
			  background-color: #fff;   
			  border: 2rpx solid #efefef;   
			  z-index: 999999;   
			  overflow-y: auto;   
			  padding: 0 20rpx;   
			  color: #444;
				border-bottom: 20rpx solid #eee;
				.title_hi{
				  font-size: 30rpx;
				  padding: 22rpx 0;
				  display: flex;
				  justify-content: space-between;
				  align-items: center;
				}
				image{
				  width: 40rpx;
				  height: 40rpx;
				}
				.his_item{
				  height: auto;
				  width: 100%;
				  color: #444;
				  padding: 6rpx 0;
				}
			}
			.cancel_hi{
			  color: #FDD605;
			  margin-left: 20rpx;
			}
		}
	
		.steps-wraper {
			padding: 20rpx;
			width: 100%;
			// height: calc(100% - 120rpx);
			.track_wraper {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;

				.time {
					width: 184rpx;
					height: 100%;
					border-right: .0625rem solid #ccc;
					color: #666;
					font-size: 26rpx;
					padding-bottom: 70rpx;

					.view-p:nth-child(2) {
						font-size: 24rpx;
					}
				}

				.express_word {
					position: relative;
					flex: 1;
					display: flex;
					justify-content: flex-start;
					align-items: flex-start;
					padding: 0 30rpx 0 60rpx;
					font-size: 24rpx;

					.express_word_icon {
						position: absolute;
						left: -16rpx;
						top: 0;
						display: block;
						width: 32rpx;
						height: 32rpx;
						border-radius: 16rpx;
						background-color: #ccc;
					}

					.express_word_text {
						width: 100%;
						height: auto;

						>.view-p {
							word-break: break-all;
							width: 100%;
							height: auto;
							font-size: 24rpx;
							color: #666;
						}
					}

					.mgr_5 {
						margin-right: 10rpx;
						color: $ztd-color-primary;
					}

					.mglr_5 {
						margin: 0 10rpx;
					}
				}
			}

			.track_wraper:last-child {
				.time {
					border-right: none;
				}
			}

			.track_wraper:first-child {
				.express_word_icon {
					width: 32rpx;
					height: 32rpx;
					border-radius: 16rpx;
					// background-image:url('../images/liwu.png')  no-repeat center;
					background-color: $ztd-color-primary;
					background-size: 65%;
				}
			}

		}

		.unlist {
			height: 480rpx;
			width: 100%;
			display: -webkit-box;
			display: -moz-box;
			display: -ms-flexbox;
			display: -weblit-flex;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			color: #666;
			border-radius: 6rpx;

			image {
				width: 228rpx;
				height: 196rpx;
				margin-bottom: 25rpx;
			}
		}

	}
</style>
